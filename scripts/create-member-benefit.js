#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * Creates a member benefit for a store from a CSV of members, until the
 * dashboard can.
 *
 *   node scripts/create-member-benefit.js \
 *     --store 64f1c2...            the store's _id
 *     --type credit                credit | discount | freeItem
 *     --amount 75                  dollars for credit and discount, garments for freeItem
 *     --name "Employee Apparel Credit"
 *     --members Employees          plural, what the people are called
 *     --csv ./members.csv          header row: email, and optionally firstName, lastName
 *     [--instructions "Enter your company email to activate your credit."]
 *     [--logo /images/acme.png]
 *     [--access public|members]    default public
 *     [--funding client|macaport]  default client
 *     [--products id1,id2]         freeItem only: store product ids that qualify
 *     [--replace]                  allow a store that already has a benefit
 *     [--apply]                    write; without it, this only reports
 *
 * Emails are trimmed, lowercased and deduplicated. Rows without a usable
 * email are listed and dropped. Nothing is written without --apply.
 */
const fs = require('fs');
const { loadEnvConfig } = require('@next/env');
const { MongoClient, ObjectID } = require('mongodb');

loadEnvConfig(process.cwd());

function args() {
  const out = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Just enough CSV: a header row, comma separated, optional double quotes.
function parseCsv(text) {
  const rows = text
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(line => {
      const cells = [];
      let current = '';
      let quoted = false;
      for (const ch of line) {
        if (ch === '"') quoted = !quoted;
        else if (ch === ',' && !quoted) {
          cells.push(current);
          current = '';
        } else current += ch;
      }
      cells.push(current);
      return cells.map(c => c.trim());
    });

  const header = rows.shift().map(h => h.toLowerCase().replace(/[^a-z]/g, ''));
  const col = name => header.indexOf(name);
  const emailCol = col('email') !== -1 ? col('email') : col('emailaddress');
  const firstCol = col('firstname') !== -1 ? col('firstname') : col('first');
  const lastCol = col('lastname') !== -1 ? col('lastname') : col('last');

  if (emailCol === -1) {
    throw new Error(`No email column found. Header was: ${header.join(', ')}`);
  }

  return rows.map(cells => ({
    email: (cells[emailCol] || '').trim().toLowerCase(),
    firstName: firstCol !== -1 ? cells[firstCol] || '' : '',
    lastName: lastCol !== -1 ? cells[lastCol] || '' : '',
  }));
}

async function main() {
  const opts = args();
  const required = ['store', 'type', 'amount', 'name', 'members', 'csv'];
  const missing = required.filter(key => !opts[key]);
  if (missing.length) {
    throw new Error(`Missing: ${missing.map(m => `--${m}`).join(', ')}`);
  }

  if (!['credit', 'discount', 'freeItem'].includes(opts.type)) {
    throw new Error('--type must be credit, discount or freeItem');
  }
  if (!ObjectID.isValid(opts.store)) {
    throw new Error('--store is not a valid id');
  }

  const amountInput = Number(opts.amount);
  if (!Number.isFinite(amountInput) || amountInput <= 0) {
    throw new Error('--amount must be a positive number');
  }
  // Whole dollars in, cents stored. Whole dollars because the admin types
  // them, and because cents in an allowance is what puts a total under
  // Stripe's minimum.
  const amount =
    opts.type === 'freeItem'
      ? Math.round(amountInput)
      : Math.round(amountInput) * 100;

  const rows = parseCsv(fs.readFileSync(opts.csv, 'utf8'));
  const seen = new Set();
  const members = [];
  const rejected = [];

  for (const row of rows) {
    if (!EMAIL.test(row.email)) {
      rejected.push(row);
      continue;
    }
    if (seen.has(row.email)) continue;
    seen.add(row.email);
    const member = { email: row.email, used: 0, orderIds: [] };
    if (row.firstName) member.firstName = row.firstName;
    if (row.lastName) member.lastName = row.lastName;
    members.push(member);
  }

  const now = new Date().toISOString();
  const benefit = {
    storeId: opts.store,
    type: opts.type,
    amount,
    productIds:
      opts.type === 'freeItem' && opts.products
        ? String(opts.products)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : null,
    access: opts.access === 'members' ? 'members' : 'public',
    funding: opts.funding === 'macaport' ? 'macaport' : 'client',
    copy: {
      benefitName: opts.name,
      memberLabel: opts.members,
      ...(opts.instructions && { instructions: opts.instructions }),
      ...(opts.logo && { logo: opts.logo }),
    },
    active: true,
    members,
    createdAt: now,
    updatedAt: now,
  };

  console.log(`${opts.apply ? 'APPLYING' : 'DRY RUN (pass --apply to write)'}`);
  console.log(`store:    ${opts.store}`);
  console.log(`type:     ${benefit.type}`);
  console.log(
    `amount:   ${
      benefit.type === 'freeItem'
        ? `${amount} garment(s)`
        : `$${(amount / 100).toFixed(2)}`
    }`
  );
  console.log(`name:     ${benefit.copy.benefitName}`);
  console.log(`members:  ${members.length} (${benefit.copy.memberLabel})`);
  console.log(`access:   ${benefit.access}, funding: ${benefit.funding}`);
  if (rejected.length) {
    console.log(`rejected: ${rejected.length} row(s) without a usable email:`);
    rejected.forEach(r => console.log(`  ${JSON.stringify(r)}`));
  }
  const named = members.filter(m => m.firstName || m.lastName).length;
  console.log(`names:    ${named} of ${members.length} members have a name`);

  const client = new MongoClient(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db();

  const store = await db
    .collection('stores')
    .findOne(
      { _id: new ObjectID(opts.store) },
      { projection: { name: 1, benefitId: 1 } }
    );

  if (!store) throw new Error('No store with that id');
  console.log(`store is "${store.name}"`);

  if (store.benefitId && !opts.replace) {
    throw new Error(
      `Store already has benefit ${store.benefitId}. Pass --replace to point it at a new one.`
    );
  }

  if (opts.apply) {
    const inserted = await db.collection('memberBenefits').insertOne(benefit);
    const benefitId = String(inserted.insertedId);
    await db
      .collection('stores')
      .updateOne({ _id: store._id }, { $set: { benefitId } });
    await db
      .collection('memberBenefitCodes')
      .createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
    await db
      .collection('memberBenefitCodes')
      .createIndex({ benefitId: 1, email: 1 }, { unique: true });
    console.log(
      `wrote memberBenefits/${benefitId} and set the store's benefitId`
    );
  }

  await client.close();
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
