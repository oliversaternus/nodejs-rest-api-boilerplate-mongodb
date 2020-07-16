import { Router } from 'express';
import { db } from "../database/init";
import autoCatch from '../tools/autocatch';
import { User } from '../types/User';
import * as jwt from "jsonwebtoken";
import * as hashJS from "hash.js";
import { secret } from '../tools/auth';

export const authRouterFactory = () => Router()

    .post('/auth/login', autoCatch(async (req, res, next) => {
        const { username, password } = req.body;
        const user = await db.collection('users').findOne({
            username,
            password: hashJS.sha256().update(password).digest("hex")
        }) as User;

        if (!user) {
            res.sendStatus(401);
            return;
        }
        const token: string = jwt.sign(
            { data: { id: user._id, role: user.role } },
            secret,
            { expiresIn: 604800000 });

        res.json({ token });
    }));