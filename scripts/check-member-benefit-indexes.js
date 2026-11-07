#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * Reports, and optionally creates, the indexes memberBenefitCodes needs.
 *
 *   node scripts/check-member-benefit-indexes.js
 *   node scripts/check-member-benefit-indexes.js --apply
 *
 * Point it at any database the way the other scripts take one:
 *
 *   DATABASE_URL='<connection string>' node scripts/check-member-benefit-indexes.js
 *
 * These used to exist only as a side effect of migrate-member-benefits.js
 * and create-member-benefit.js, so a database that had neither run against
 * it, or that was wiped afterwards, silently lost them. Neither is needed
 * for correctness — the code flow works without them — but without the TTL
 * index expired code records are never swept, and without the unique index
 * two requests racing for the same email could leave two records, of which
 * only one would ever be found.
 *
 * Creating an index that already exists is a no-op, so --apply is safe to
 * run against any environment, including production.
 */
const { loadEnvConfig } = require(require.resolve('@next/env', {
  paths: [require.resolve('next/package.json')],
}));
const { MongoClient } = require('mongodb');

loadEnvConfig(process.cwd());

const APPLY = process.argv.includes('--apply');
const COLLECTION = 'memberBenefitCodes';

const WANTED = [
  {
    name: 'expires_1',
    spec: { expires: 1 },
    options: { expireAfterSeconds: 0 },
    describe: 'TTL: Mongo sweeps expired code records',
    matches: index => index.expireAfterSeconds === 0,
  },
  {
    name: 'benefitId_1_email_1',
    spec: { benefitId: 1, email: 1 },
    options: { unique: true },
    describe: 'unique: one outstanding code per benefit and email',
    matches: index => index.unique === true,
  },
];

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const client = new MongoClient(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db();

  const host = process.env.DATABASE_URL.replace(
    /^mongodb(\+srv)?:\/\/[^@]*@/,
    ''
  ).split(/[/?]/)[0];
  console.log(
    `${APPLY ? 'APPLYING' : 'CHECKING'} ${host} / ${db.databaseName}`
  );

  const collections = (await db.listCollections().toArray()).map(c => c.name);
  const existing = collections.includes(COLLECTION)
    ? await db.collection(COLLECTION).indexes()
    : [];

  if (!collections.includes(COLLECTION)) {
    console.log(
      `${COLLECTION} does not exist yet; creating an index creates it.`
    );
  }

  let missing = 0;

  for (const wanted of WANTED) {
    const found = existing.find(i => i.name === wanted.name);
    const ok = found && wanted.matches(found);

    if (ok) {
      console.log(`  ok      ${wanted.name}  (${wanted.describe})`);
      continue;
    }

    missing++;
    console.log(
      `  MISSING ${wanted.name}  (${wanted.describe})${
        found ? ' — exists but with the wrong options' : ''
      }`
    );

    if (APPLY) {
      if (found) await db.collection(COLLECTION).dropIndex(wanted.name);
      await db
        .collection(COLLECTION)
        .createIndex(wanted.spec, { name: wanted.name, ...wanted.options });
      console.log(`          created`);
    }
  }

  if (missing === 0) {
    console.log('Both indexes are in place.');
  } else if (!APPLY) {
    console.log(`\n${missing} missing. Re-run with --apply to create them.`);
  }

  await client.close();
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
