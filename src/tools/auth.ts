import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserContext } from "../types/UserContext";

export const secret = 'abcdefghijklmonpq';

export const verifyUser = (token: string): UserContext | undefined => {
    try {
        const decrypted: any = jwt.verify(token, secret);
        return decrypted.data as UserContext;
    } catch (e) {
        return undefined;
    }
};

export function autoVerifyUser(input: (req: Request, res: Response, user: UserContext, next: NextFunction) => Promise<void>):
    (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req, res, next) => {
        const token = req.get("Authorization");
        const user = token && verifyUser(token);
        if (!user) {
            next({ statusCode: 401 })
            return;
        }
        await input(req, res, user, next);
    };
}