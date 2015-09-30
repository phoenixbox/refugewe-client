/*eslint-env node */
export const RAILSRoot = process.env.NODE_ENV === 'production' ? 'https://refugewe-server.herokuapp.com': 'http://127.0.0.1:3000';
export const HAPIRoot = process.env.NODE_ENV === 'production' ? 'https://refugewe.herokuapp.com': 'http://127.0.0.1:3700';
export const GA_KEY = process.env.GA_KEY || '';
