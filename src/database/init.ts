import { sequelize } from './sequelize';
import { User } from '../models/User';
import * as hashJS from "hash.js";

export const init = async (options?: { force?: boolean, test?: boolean }) => {
    const db = sequelize(options?.test ? { dialect: 'sqlite', storage: ':memory:' } : undefined);
    await db.sync({ force: options?.force });

    options?.test && await populate();
};

const populate = async () => {
    await User.create({
        username: 'superAdmin',
        role: 'admin',
        email: 'admin@mail.com',
        password: hashJS.sha256().update('bananarama').digest("hex")
    });
};