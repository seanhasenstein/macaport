#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * Moves the three hand-built programs onto the memberBenefits collection.
 *
 *   node scripts/migrate-member-benefits.js           dry run, writes nothing
 *   node scripts/migrate-member-benefits.js --apply   writes
 *
 * Reads DATABASE_URL from .env.local the way the app does. Safe to run more
 * than once: a store that already has a benefitId is skipped, and an order
 * that already has summary.adjustments is left alone.
 *
 * For every store pointing at a teacherAppreciation, sheboyganLutheranStaff
 * or switchFitnessDiscount document it:
 *
 *   1. writes one memberBenefits document of the matching type, with the
 *      eligible list as members and the used list folded into each member's
 *      `used` (the old programs were one-shot, so a used email has used the
 *      whole allowance);
 *   2. sets the store's benefitId;
 *   3. rewrites each of the store's orders that used the old program so it
 *      carries summary.adjustments and `benefit`, the shape every renderer
 *      now reads. The legacy fields are left in place.
 *
 * It also creates the TTL index that sweeps expired one-time codes. The old
 * collections are not touched or dropped; do that by hand once the new
 * documents have been checked.
 */
const { loadEnvConfig } = require('@next/env');
const { MongoClient, ObjectID } = require('mongodb');

loadEnvConfig(process.cwd());

const APPLY = process.argv.includes('--apply');

const normalize = email =>
  String(email || '')
    .trim()
    .toLowerCase();

function membersFrom(emails, usedEmails, usedValue, names = {}) {
  const used = new Set(usedEmails.map(normalize));
  const seen = new Set();
  const members = [];

  for (const raw of emails) {
    const email = normalize(raw);
    if (!email || seen.has(email)) continue;
    seen.add(email);
    const member = {
      email,
      used: used.has(email) ? usedValue : 0,
      orderIds: [],
    };
    if (names[email]) Object.assign(member, names[email]);
    members.push(member);
  }

  return members;
}

async function loadSources(db, store) {
  const sources = [];

  if (
    store.teacherAppreciationId &&
    ObjectID.isValid(store.teacherAppreciationId)
  ) {
    const doc = await db
      .collection('teacherAppreciation')
      .findOne({ _id: new ObjectID(store.teacherAppreciationId) });
    if (doc) {
      sources.push({
        kind: 'teacherAppreciation',
        doc,
        benefit: {
          type: 'freeItem',
          amount: 1,
          productIds: null,
          copy: {
            benefitName: 'Free Staff Appreciation Shirt',
            memberLabel: 'Staff',
            instructions:
              'For staff appreciation week, the district is giving a free shirt to all staff. Enter your school email to redeem.',
            logo: '/images/new-london-bulldog-logo.png',
          },
          active: !!doc.active,
          members: membersFrom(
            doc.eligibleEmails || [],
            doc.usedEmails || [],
            1
          ),
        },
      });
    }
  }

  if (
    store.sheboyganLutheranStaffId &&
    ObjectID.isValid(store.sheboyganLutheranStaffId)
  ) {
    const doc = await db
      .collection('sheboyganLutheranStaff')
      .findOne({ _id: new ObjectID(store.sheboyganLutheranStaffId) });
    if (doc) {
      const names = {};
      for (const account of doc.eligibleAccounts || []) {
        names[normalize(account.email)] = {
          firstName: account.firstName || undefined,
          lastName: account.lastName || undefined,
        };
      }
      sources.push({
        kind: 'sheboyganLutheranStaff',
        doc,
        benefit: {
          type: 'credit',
          amount: doc.discount,
          productIds: null,
          copy: {
            benefitName: 'Sheboygan Lutheran Staff Credit',
            memberLabel: 'Staff members',
            instructions:
              'Enter your lutheranhigh.com email to activate your apparel credit.',
            logo: '/images/sheboygan-lutheran-shield.webp',
          },
          active: !!doc.active,
          members: membersFrom(
            (doc.eligibleAccounts || []).map(a => a.email),
            doc.usedEmails || [],
            doc.discount,
            names
          ),
        },
      });
    }
  }

  const switchId = store.meta && store.meta.switchFitnessDiscountId;
  if (switchId && ObjectID.isValid(switchId)) {
    const doc = await db
      .collection('switchFitnessDiscount')
      .findOne({ _id: new ObjectID(switchId) });
    if (doc) {
      sources.push({
        kind: 'switchFitnessDiscount',
        doc,
        benefit: {
          type: 'discount',
          amount: doc.discount,
          productIds: null,
          copy: {
            benefitName: 'Switch Fitness Promo',
            memberLabel: 'Members',
            instructions:
              "We're excited to offer $25 off of Switch Fitness apparel. Enter a verified email address to redeem.",
            logo: '/images/switch-fitness-logo.png',
          },
          active: !!doc.active,
          members: membersFrom(
            doc.eligibleEmails || [],
            doc.usedEmails || [],
            doc.discount
          ),
        },
      });
    }
  }

  return sources;
}

// The adjustments and benefit link an old order should have carried.
function legacyOrderRewrite(order, source, benefitId) {
  if (order.summary && order.summary.adjustments) return null;

  if (
    source.kind === 'sheboyganLutheranStaff' &&
    order.sheboyganLutheranStaffDiscount
  ) {
    const amount = order.sheboyganLutheranStaffDiscount.discount || 0;
    return {
      adjustments: [
        {
          kind: 'credit',
          label: source.benefit.copy.benefitName,
          amount: -amount,
        },
      ],
      benefit: {
        benefitId,
        type: 'credit',
        email: normalize(order.sheboyganLutheranStaffDiscount.email),
        used: amount,
        remainingAfter: 0,
      },
    };
  }

  if (source.kind === 'switchFitnessDiscount' && order.switchFitnessDiscount) {
    const amount =
      (order.summary && order.summary.discount) || source.doc.discount || 0;
    return {
      adjustments: [
        {
          kind: 'discount',
          label: source.benefit.copy.benefitName,
          amount: -amount,
        },
      ],
      benefit: {
        benefitId,
        type: 'discount',
        email: normalize(order.switchFitnessDiscount.email),
        used: source.doc.discount || amount,
        remainingAfter: 0,
      },
    };
  }

  if (source.kind === 'teacherAppreciation' && order.teacherAppreciation) {
    const freeItem = (order.items || []).find(item => item.itemTotal === 0);
    return {
      adjustments: freeItem
        ? [
            {
              kind: 'freeItem',
              label: source.benefit.copy.benefitName,
              amount: -(
                (freeItem.sku &&
                  freeItem.sku.size &&
                  freeItem.sku.size.price) ||
                0
              ),
              lineId: freeItem.id,
              units: 1,
            },
          ]
        : [],
      benefit: {
        benefitId,
        type: 'freeItem',
        email: normalize(order.teacherAppreciation.email),
        used: 1,
        remainingAfter: 0,
      },
    };
  }

  return null;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = new MongoClient(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db();

  console.log(APPLY ? 'APPLYING changes' : 'DRY RUN (pass --apply to write)');

  const stores = await db
    .collection('stores')
    .find({
      $or: [
        { teacherAppreciationId: { $exists: true, $nin: [null, ''] } },
        { sheboyganLutheranStaffId: { $exists: true, $nin: [null, ''] } },
        { 'meta.switchFitnessDiscountId': { $exists: true, $nin: [null, ''] } },
      ],
    })
    .project({
      name: 1,
      teacherAppreciationId: 1,
      sheboyganLutheranStaffId: 1,
      meta: 1,
      benefitId: 1,
      orders: 1,
    })
    .toArray();

  console.log(`${stores.length} store(s) point at an old program`);

  for (const store of stores) {
    const label = `${store.name} (${store._id})`;

    if (store.benefitId) {
      console.log(
        `- ${label}: already has benefitId ${store.benefitId}, skipping`
      );
      continue;
    }

    const sources = await loadSources(db, store);

    if (sources.length === 0) {
      console.log(
        `- ${label}: points at a program document that no longer exists, skipping`
      );
      continue;
    }

    if (sources.length > 1) {
      console.log(
        `- ${label}: points at ${sources.length} programs (${sources
          .map(s => s.kind)
          .join(', ')}); one benefit per store, resolve by hand, skipping`
      );
      continue;
    }

    const [source] = sources;
    const now = new Date().toISOString();
    const benefit = {
      storeId: String(store._id),
      ...source.benefit,
      access: 'public',
      funding: 'client',
      createdAt: now,
      updatedAt: now,
    };

    const usedCount = benefit.members.filter(m => m.used > 0).length;
    console.log(
      `- ${label}: ${source.kind} -> ${benefit.type} (${benefit.amount}), ${benefit.members.length} members, ${usedCount} already used, active=${benefit.active}`
    );

    const orders = (store.orders || [])
      .map(order => ({
        order,
        rewrite: legacyOrderRewrite(order, source, '<pending>'),
      }))
      .filter(entry => entry.rewrite);

    console.log(`    ${orders.length} order(s) to rewrite`);

    if (!APPLY) continue;

    const inserted = await db.collection('memberBenefits').insertOne(benefit);
    const benefitId = String(inserted.insertedId);

    await db
      .collection('stores')
      .updateOne({ _id: store._id }, { $set: { benefitId } });

    for (const { order } of orders) {
      const rewrite = legacyOrderRewrite(order, source, benefitId);
      await db.collection('stores').updateOne(
        { _id: store._id, 'orders.orderId': order.orderId },
        {
          $set: {
            'orders.$.summary.adjustments': rewrite.adjustments,
            'orders.$.benefit': rewrite.benefit,
          },
        }
      );
      // Link the order from the member as the storefront now does.
      await db
        .collection('memberBenefits')
        .updateOne(
          { _id: inserted.insertedId, 'members.email': rewrite.benefit.email },
          { $push: { 'members.$.orderIds': order.orderId } }
        );
    }

    console.log(`    wrote memberBenefits/${benefitId}`);
  }

  // Expired one-time codes are swept by Mongo rather than by any code path.
  if (APPLY) {
    await db
      .collection('memberBenefitCodes')
      .createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
    await db
      .collection('memberBenefitCodes')
      .createIndex({ benefitId: 1, email: 1 }, { unique: true });
    console.log('memberBenefitCodes indexes in place');
  }

  await client.close();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
