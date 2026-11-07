#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * Replaces every real email address in a TEST database with an alias of your
 * own, so nothing a test does can reach a stranger.
 *
 *   node scripts/scrub-test-emails.js --host <part of the cluster hostname>
 *   node scripts/scrub-test-emails.js --host <part of the cluster hostname> --apply
 *
 * --host is required and must match the host in DATABASE_URL. It exists so
 * that this cannot be run against a database you did not name on purpose:
 * pointed at production it would destroy every customer's address.
 *
 * Every address is rewritten to <keep>+t<hash>@<domain>, where the hash is
 * derived from the original, so the same person stays the same alias
 * everywhere (a member's email on the benefit still matches their orders).
 * Addresses that already belong to you (--keep, default seanhasenstein@gmail.com,
 * including its plus-aliases) are left alone.
 *
 * Touches: memberBenefits.members[].email, stores.orders[].customer.email,
 * stores.orders[].benefit.email, stores.contact.email,
 * contactMessages.submission.email. Deletes memberBenefitCodes outright.
 */
const crypto = require('crypto');
const { loadEnvConfig } = require(require.resolve('@next/env', {
  paths: [require.resolve('next/package.json')],
}));
const { MongoClient } = require('mongodb');

loadEnvConfig(process.cwd());

const argv = process.argv.slice(2);
const opt = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const APPLY = argv.includes('--apply');
const HOST = opt('host');
const KEEP = (opt('keep') || 'seanhasenstein@gmail.com').toLowerCase();
const [keepLocal, keepDomain] = KEEP.split('@');

if (!HOST) {
  console.error('--host <part of the cluster hostname> is required');
  process.exit(1);
}

const url = process.env.DATABASE_URL || '';
const hostPart = url
  .replace(/^mongodb(\+srv)?:\/\/[^@]*@/, '')
  .split(/[/?]/)[0];
if (!hostPart.includes(HOST)) {
  console.error(
    `DATABASE_URL host "${hostPart}" does not contain "${HOST}"; refusing`
  );
  process.exit(1);
}

const seen = new Map();
function alias(email) {
  if (typeof email !== 'string' || !email.includes('@')) return email;
  const lower = email.trim().toLowerCase();
  const [local, domain] = lower.split('@');
  if (domain === keepDomain && local.split('+')[0] === keepLocal) return lower;
  if (!seen.has(lower)) {
    const hash = crypto
      .createHash('sha1')
      .update(lower)
      .digest('hex')
      .slice(0, 6);
    seen.set(lower, `${keepLocal}+t${hash}@${keepDomain}`);
  }
  return seen.get(lower);
}

async function main() {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db();
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} on ${hostPart} / ${db.databaseName}`
  );

  let changed = 0;

  // Benefits: member emails.
  for (const benefit of await db
    .collection('memberBenefits')
    .find({})
    .toArray()) {
    const members = (benefit.members || []).map(m => ({
      ...m,
      email: alias(m.email),
    }));
    const touched = members.filter(
      (m, i) => m.email !== benefit.members[i].email
    ).length;
    if (touched === 0) continue;
    changed += touched;
    console.log(`memberBenefits/${benefit._id}: ${touched} member email(s)`);
    if (APPLY) {
      await db
        .collection('memberBenefits')
        .updateOne({ _id: benefit._id }, { $set: { members } });
    }
  }

  // Stores: contact, and every order's customer and benefit link.
  const stores = db
    .collection('stores')
    .find({}, { projection: { name: 1, contact: 1, orders: 1 } });
  for await (const store of stores) {
    const set = {};
    if (store.contact && store.contact.email) {
      const next = alias(store.contact.email);
      if (next !== store.contact.email) set['contact.email'] = next;
    }
    let touched = 0;
    const orders = (store.orders || []).map(order => {
      const copy = { ...order };
      if (copy.customer && copy.customer.email) {
        const next = alias(copy.customer.email);
        if (next !== copy.customer.email) {
          copy.customer = { ...copy.customer, email: next };
          touched++;
        }
      }
      if (copy.benefit && copy.benefit.email) {
        const next = alias(copy.benefit.email);
        if (next !== copy.benefit.email) {
          copy.benefit = { ...copy.benefit, email: next };
          touched++;
        }
      }
      for (const key of [
        'sheboyganLutheranStaffDiscount',
        'teacherAppreciation',
        'switchFitnessDiscount',
      ]) {
        if (copy[key] && copy[key].email) {
          const next = alias(copy[key].email);
          if (next !== copy[key].email) {
            copy[key] = { ...copy[key], email: next };
            touched++;
          }
        }
      }
      return copy;
    });
    if (touched > 0) set.orders = orders;
    if (Object.keys(set).length === 0) continue;
    changed += touched + (set['contact.email'] ? 1 : 0);
    console.log(
      `stores/${store._id} (${store.name}): ${touched} order email(s)${
        set['contact.email'] ? ', contact' : ''
      }`
    );
    if (APPLY) {
      await db
        .collection('stores')
        .updateOne({ _id: store._id }, { $set: set });
    }
  }

  // Contact enquiries.
  for (const message of await db
    .collection('contactMessages')
    .find({})
    .toArray()) {
    const email = message.submission && message.submission.email;
    if (!email) continue;
    const next = alias(email);
    if (next === email) continue;
    changed++;
    if (APPLY) {
      await db
        .collection('contactMessages')
        .updateOne(
          { _id: message._id },
          { $set: { 'submission.email': next } }
        );
    }
  }

  // Codes in flight are worthless once their emails change.
  const codes = await db.collection('memberBenefitCodes').countDocuments();
  if (codes > 0) {
    console.log(`memberBenefitCodes: ${codes} record(s) to delete`);
    if (APPLY) await db.collection('memberBenefitCodes').deleteMany({});
  }

  console.log(
    `${changed} address(es) ${APPLY ? 'rewritten' : 'would be rewritten'}, ${
      seen.size
    } distinct`
  );
  await client.close();
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
