import { Db, ObjectID, OptionalId, WithId } from 'mongodb';

import { SwitchFitnessDiscount } from 'interfaces';

export async function getSwitchFitnessDiscountById(db: Db, _id: string) {
  const switchFitness = await db
    .collection<WithId<SwitchFitnessDiscount>>('switchFitnessDiscount')
    .findOne({ _id: new ObjectID(_id) });

  return switchFitness;
}

// ****************************************************

export async function verifySwitchFitnessEmailEligibility(
  db: Db,
  _id: string,
  email: string
) {
  const switchFitness = await db
    .collection<OptionalId<SwitchFitnessDiscount>>('switchFitnessDiscount')
    .findOne({ _id: new ObjectID(_id) });

  if (!switchFitness) {
    throw new Error('Switch Fitness discount not found');
  }

  const lowercaseEmail = email.toLowerCase();

  const isEligible =
    switchFitness?.eligibleEmails.includes(lowercaseEmail) &&
    !switchFitness?.usedEmails.includes(lowercaseEmail);
  const alreadyUsed = switchFitness?.usedEmails.includes(lowercaseEmail);
  return { isEligible, alreadyUsed };
}

// ****************************************************

export async function addUsedEmailToSwitchFitness(
  db: Db,
  _id: string,
  email: string
) {
  const switchFitness = await db
    .collection<OptionalId<SwitchFitnessDiscount>>('switchFitnessDiscount')
    .findOne({ _id: new ObjectID(_id) });

  if (!switchFitness) {
    throw new Error('Teacher appreciation not found');
  }

  if (switchFitness.usedEmails.includes(email)) {
    throw new Error('Email has already been used');
  }

  const lowercaseEmail = email.toLowerCase();

  const updateResult = await db
    .collection<OptionalId<SwitchFitnessDiscount>>('switchFitnessDiscount')
    .updateOne(
      { _id: new ObjectID(_id) },
      { $push: { usedEmails: lowercaseEmail } }
    );
  if (updateResult.result.ok === 0) {
    throw new Error('Failed to add teacher appreciation email to usedEmails');
  }

  const updatedSwitchFitness: SwitchFitnessDiscount = {
    ...switchFitness,
    _id,
    usedEmails: [...switchFitness.usedEmails, email],
  };
  return updatedSwitchFitness;
}
