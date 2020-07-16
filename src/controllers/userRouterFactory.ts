import { Router } from 'express';
import { User } from '../types/User';
import { db } from "../database/init";
import autoCatch from '../tools/autocatch';
import { autoVerifyUser } from '../tools/auth';
import { ObjectID } from 'mongodb';
import * as hashJS from "hash.js";

export const userRouterFactory = () => Router()

  .get('/users', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    if (currentUser.role !== 'admin') {
      next({ statusCode: 403 });
      return;
    }
    const users = await db.collection('users').find({}).toArray() as User[];
    res.json(users);
  })))

  .get('/users/me', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    const user = await db.collection('users').findOne(
      { _id: new ObjectID(currentUser.id) }) as User;
    res.json(user);
  })))

  .post('/users',
    autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
      if (currentUser.role !== 'admin') {
        next({ statusCode: 403 });
        return;
      }
      const { _id, ...user } = req.body as User;
      const result = await db.collection('users').insertOne(
        {
          ...user,
          password: hashJS.sha256().update(req.body.password).digest("hex")
        });
      res.json(result.ops[0]);
    })))

  .put('/users/:id', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    if (currentUser.id !== req.params.id) {
      next({ statusCode: 400 });
      return;
    }
    const { _id, ...user } = req.body as User;
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectID(currentUser.id) },
      {
        ...user,
        ...(user.password && { password: hashJS.sha256().update(user.password).digest("hex") })
      },
      { returnOriginal: false }
    );
    res.json(result.value as User);
  })));
