import fetch from 'node-fetch';

let baseUrl = '';
let authToken = '';

export const initApi = (base: string) => baseUrl = base;
export const login = () => { };

export const invokeApi = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, body?: any, query?: string, auth?: boolean) => {
    try {
        const response = await fetch(baseUrl + path, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(auth && { Authorization: authToken })
            },
            body: body && JSON.stringify(body)
        });
        const data = response.status === 200 ? await response.json() : undefined;
        return { status: response.status, data }
    } catch (e) {
        return undefined;
    }
};