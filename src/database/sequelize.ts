import { Sequelize } from 'sequelize-typescript';
import * as path from "path";

import { User } from '../models/User';
import { Post } from '../models/Post';

type Options = { dialect: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql", storage: string };

export const sequelize = (options?: Options) => new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, "../", "../", "data.db"),
  models: [User, Post],
  logging: false,
  ...options
});
