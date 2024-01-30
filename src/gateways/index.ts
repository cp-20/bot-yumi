import { Api } from './api-client';

const accessToken = process.env.TRAQ_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('TRAQ_ACCESS_TOKEN is not set');
}

export const api = new Api({
  baseApiParams: { headers: { Authorization: `Bearer ${accessToken}` } },
});
