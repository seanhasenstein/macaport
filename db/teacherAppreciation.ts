import { Db, ObjectID, OptionalId } from 'mongodb';

import { TeacherAppreciation } from 'interfaces';

export async function getTeacherAppreciationById(db: Db, _id: string) {
  const teacherAppreciation = await db
    .collection<OptionalId<TeacherAppreciation>>('teacherAppreciation')
    .findOne({ _id: new ObjectID(_id) });

  return teacherAppreciation;
}

// ****************************************************

export async function verifyTeacherAppreciationEmailEligibility(
  db: Db,
  _id: string,
  email: string
) {
  const teacherAppreciation = await db
    .collection<OptionalId<TeacherAppreciation>>('teacherAppreciation')
    .findOne({ _id: new ObjectID(_id) });

  if (!teacherAppreciation) {
    throw new Error('Teacher appreciation not found');
  }

  const lowercaseEmail = email.toLowerCase();

  const paused = !teacherAppreciation.active;
  const alreadyUsed = teacherAppreciation.usedEmails.includes(lowercaseEmail);
  const isEligible =
    !paused &&
    teacherAppreciation.eligibleEmails.includes(lowercaseEmail) &&
    !alreadyUsed;
  return { isEligible, alreadyUsed, paused };
}

// ****************************************************

export async function addUsedEmailToTeacherAppreciation(
  db: Db,
  _id: string,
  email: string
) {
  const teacherAppreciation = await db
    .collection<OptionalId<TeacherAppreciation>>('teacherAppreciation')
    .findOne({ _id: new ObjectID(_id) });

  if (!teacherAppreciation) {
    throw new Error('Teacher appreciation not found');
  }

  if (teacherAppreciation.usedEmails.includes(email)) {
    throw new Error('Email has already been used');
  }

  const lowercaseEmail = email.toLowerCase();

  const updateResult = await db
    .collection<OptionalId<TeacherAppreciation>>('teacherAppreciation')
    .updateOne(
      { _id: new ObjectID(_id) },
      { $push: { usedEmails: lowercaseEmail } }
    );
  if (updateResult.result.ok === 0) {
    throw new Error('Failed to add teacher appreciation email to usedEmails');
  }

  const updatedTeacherAppreciation: TeacherAppreciation = {
    ...teacherAppreciation,
    _id,
    usedEmails: [...teacherAppreciation.usedEmails, email],
  };
  return updatedTeacherAppreciation;
}
