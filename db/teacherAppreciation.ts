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

  const normalizedEmail = email.trim().toLowerCase();
  const eligibleEmails = teacherAppreciation.eligibleEmails.map(e =>
    e.trim().toLowerCase()
  );
  const usedEmails = teacherAppreciation.usedEmails.map(e =>
    e.trim().toLowerCase()
  );

  const paused = !teacherAppreciation.active;
  const alreadyUsed = usedEmails.includes(normalizedEmail);
  const isEligible =
    !paused && eligibleEmails.includes(normalizedEmail) && !alreadyUsed;
  return { isEligible, alreadyUsed, paused, email: normalizedEmail };
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

  const normalizedEmail = email.trim().toLowerCase();
  const usedEmails = teacherAppreciation.usedEmails.map(e =>
    e.trim().toLowerCase()
  );

  if (usedEmails.includes(normalizedEmail)) {
    throw new Error('Email has already been used');
  }

  const updateResult = await db
    .collection<OptionalId<TeacherAppreciation>>('teacherAppreciation')
    .updateOne(
      { _id: new ObjectID(_id) },
      { $push: { usedEmails: normalizedEmail } }
    );
  if (updateResult.result.ok === 0) {
    throw new Error('Failed to add teacher appreciation email to usedEmails');
  }

  const updatedTeacherAppreciation: TeacherAppreciation = {
    ...teacherAppreciation,
    _id,
    usedEmails: [...teacherAppreciation.usedEmails, normalizedEmail],
  };
  return updatedTeacherAppreciation;
}
