import { Router } from 'express';
import { User } from '../models/User';
import autoCatch from '../tools/autocatch';
import { autoVerifyUser } from '../tools/auth';
import * as hashJS from "hash.js";

export const userRouterFactory = () => Router()

  .get('/users', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    if (currentUser.role !== 'admin') {
      next({ statusCode: 403 });
      return;
    }
    const users = await User.findAll({ attributes: { exclude: ['createdAt', 'updatedAt', 'password'] } });
    res.json(users);
  })))

  .get('/users/me', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    const user = await User.findByPk(currentUser.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  })))

  .post('/users', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    if (currentUser.role !== 'admin') {
      next({ statusCode: 403 });
      return;
    }
    const user = await User.create({ ...req.body, password: hashJS.sha256().update(req.body.password).digest("hex") });
    res.json(user);
  })))

  .put('/users/:id', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    if (currentUser.id !== req.params.id) {
      next({ statusCode: 400 });
      return;
    }
    const user = await User.findByPk(currentUser.id);
    await user.update({ password: hashJS.sha256().update(req.body.password).digest("hex") });
    res.json(user);
  })));
