import * as hashJS from "hash.js";
import { connectDB, conn } from './mongo';
import { Db } from 'mongodb';

export let db: Db;

export const init = async (options?: { test?: boolean }) => {
    await connectDB();
    db = conn.db(options?.test ? 'test' : 'example');
    options?.test && await populate();
};

const populate = async () => {
    db.collection('users').insertOne({
        username: 'superAdmin',
        role: 'admin',
        email: 'admin@mail.com',
        password: hashJS.sha256().update('bananarama').digest("hex")
    });
};