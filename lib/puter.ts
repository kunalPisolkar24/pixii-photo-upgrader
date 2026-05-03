import { Puter } from '@heyputer/puter.js';
import { init } from '@heyputer/puter.js/src/init.cjs';

const token = process.env.PUTER_AUTH_TOKEN || '';

if (!token) {
  throw new Error("Missing Puter authentication token");
}

export const puter = init(token) as Puter;
