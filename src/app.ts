import * as express from 'express';
import * as strongErrorHandler from 'strong-error-handler';
import { json } from 'body-parser';
import { createServer, Server } from 'http';
import { init } from './database/init';

import { userRouterFactory } from './controllers/userRouterFactory';
import { postRouterFactory } from './controllers/postRouterFactory';
import { authRouterFactory } from './controllers/authRouterFactory';

export const app = express();

app.use(json());

app.use(userRouterFactory());
app.use(postRouterFactory());
app.use(authRouterFactory());

app.use(strongErrorHandler({
  debug: true,
}));

function listen(port: number | string): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = createServer(app);
    server.listen(port, (err) => {
      if (err) { return reject(err); }
      console.log(`Server listen on port ${port}`);
      return resolve(server);
    });
  });
}

export const start = async () => {
  const port = process.env.PORT || 5000;
  await init();

  await listen(port);
}


export const test = async () => {
  const port = process.env.PORT || 5050;
  await init({ force: true, test: true });
  const server = await listen(port);

  return { server, baseUrl: `http://localhost:${port}` };
}