import { Db, ObjectID, OptionalId } from 'mongodb';

import { SheboyganLutheranStaff } from 'interfaces';

// ****************************************************

export async function getSheboyganLutheranStaffById(db: Db, id: string) {
  const sheboyganLutheranStaff = await db
    .collection<OptionalId<SheboyganLutheranStaff>>('sheboyganLutheranStaff')
    .findOne({ _id: new ObjectID(id) });
  return sheboyganLutheranStaff;
}

// ****************************************************

export async function verifySheboyganLutheranStaffEligibility(
  db: Db,
  _id: string,
  email: string
) {
  const sheboyganLutheranStaff = await getSheboyganLutheranStaffById(db, _id);

  if (!sheboyganLutheranStaff) {
    throw new Error('Sheboygan Lutheran staff not found in the database');
  }

  const lowercaseEmail = email.toLowerCase();

  const alreadyUsed =
    sheboyganLutheranStaff.usedEmails.includes(lowercaseEmail);
  const isEligible =
    sheboyganLutheranStaff.eligibleAccounts.some(
      account => account.email.toLowerCase() === lowercaseEmail
    ) && !alreadyUsed;

  let firstName = '';
  let lastName = '';

  const eligibleAccount = sheboyganLutheranStaff.eligibleAccounts.find(
    account => account.email.toLowerCase() === lowercaseEmail
  );

  if (eligibleAccount && isEligible && !alreadyUsed) {
    firstName = eligibleAccount.firstName;
    lastName = eligibleAccount.lastName;
  }

  return { isEligible, alreadyUsed, firstName, lastName };
}

// ****************************************************

export async function addUsedEmailToSheboyganLutheranStaff(
  db: Db,
  _id: string,
  email: string
) {
  const sheboyganLutheranStaff = await db
    .collection<OptionalId<SheboyganLutheranStaff>>('sheboyganLutheranStaff')
    .findOne({ _id: new ObjectID(_id) });

  if (!sheboyganLutheranStaff) {
    throw new Error('Sheboygan Lutheran staff not found');
  }

  if (sheboyganLutheranStaff.usedEmails.includes(email)) {
    throw new Error('Email has already been used');
  }

  const lowercaseEmail = email.toLowerCase();

  const updateResult = await db
    .collection<OptionalId<SheboyganLutheranStaff>>('sheboyganLutheranStaff')
    .updateOne(
      { _id: new ObjectID(_id) },
      { $push: { usedEmails: lowercaseEmail } }
    );
  if (updateResult.result.ok === 0) {
    throw new Error(
      'Failed to add Sheboygan Lutheran staff email to usedEmails'
    );
  }

  const updatedSheboyganLutheranStaff: SheboyganLutheranStaff = {
    ...sheboyganLutheranStaff,
    _id,
    usedEmails: [...sheboyganLutheranStaff.usedEmails, email],
  };
  return updatedSheboyganLutheranStaff;
}
