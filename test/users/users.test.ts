import { test as initTestServer } from '../../src/app';
import { invokeApi, initApi } from '../utils';
import { Server } from 'http';
import { MongoClient } from 'mongodb';
import { conn } from '../../src/database/mongo';

let state: {
    server: Server;
    baseUrl: string;
    conn: MongoClient;
};

beforeAll(async (done) => {
    state = await initTestServer();
    initApi(state.baseUrl);
    done();
});

afterAll(async (done) => {
    state.server.close();
    conn.close();
    done();
});

test('login admin', async (done) => {
    const response = await invokeApi('POST', '/auth/login', {
        username: 'superAdmin',
        password: 'bananarama'
    });
    expect(response?.status).toBe(200);
    done();
});

test('wrong password', async (done) => {
    const response = await invokeApi('POST', '/auth/login', {
        username: 'superAdmin',
        password: 'xyz'
    });
    expect(response?.status).toBe(401);
    done();
});
