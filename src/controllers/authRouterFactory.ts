import { Router } from 'express';
import { User } from "../models/User";
import autoCatch from '../tools/autocatch';
import * as jwt from "jsonwebtoken";
import * as hashJS from "hash.js";
import { secret } from '../tools/auth';

export const authRouterFactory = () => Router()

    .post('/auth/login', autoCatch(async (req, res, next) => {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: {
                username,
                password: hashJS.sha256().update(password).digest("hex")
            }
        });
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const token: string = jwt.sign(
            { data: { id: user.id, role: user.role } },
            secret,
            { expiresIn: 604800000 });

        res.json({ token });
    }));