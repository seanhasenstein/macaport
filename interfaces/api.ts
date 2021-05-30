import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { id: string };
}
