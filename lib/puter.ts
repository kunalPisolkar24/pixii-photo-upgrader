import puter from '@heyputer/puter.js';

const token = process.env.PUTER_AUTH_TOKEN || '';

if (!token) {
  throw new Error("Missing Puter authentication token");
}

puter.setAuthToken(token);

export { puter };
