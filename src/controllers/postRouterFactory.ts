import { Router } from 'express';
import { Post } from "../models/Post";
import autoCatch from '../tools/autocatch';
import { autoVerifyUser } from '../tools/auth';

export const postRouterFactory = () => Router()

  .get('/posts', autoCatch(async (req, res, next) => {
    const posts = await Post.findAll();
    res.json(posts);
  }))

  .get('/posts/:id', autoCatch(async (req, res, next) => {
    const post = await Post.findByPk(req.params.id);
    post ? res.json(post) : next({ statusCode: 404 });
  }))

  .post('/posts', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    const post = await Post.create({ ...req.body, userId: currentUser.id });
    res.json(post);
  })));
