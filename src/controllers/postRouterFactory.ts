import { Router } from 'express';
import { Post } from "../types/Post";
import { db } from "../database/init";
import autoCatch from '../tools/autocatch';
import { autoVerifyUser } from '../tools/auth';
import { ObjectID } from 'mongodb';

export const postRouterFactory = () => Router()

  .get('/posts', autoCatch(async (req, res, next) => {
    const posts = await db.collection('posts').find({}).toArray() as Post[];
    res.json(posts);
  }))

  .get('/posts/:id', autoCatch(async (req, res, next) => {
    const post = await db.collection('posts').findOne({ _id: new ObjectID(req.params.id) }) as Post;
    post ? res.json(post) : next({ statusCode: 404 });
  }))

  .post('/posts', autoCatch(autoVerifyUser(async (req, res, currentUser, next) => {
    const { _id, ...post } = req.body as Post;
    const result = await db.collection('posts').insertOne({ ...post, userId: currentUser.id });
    res.json(result.ops[0] as Post);
  })));
