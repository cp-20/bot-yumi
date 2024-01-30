if (!process.env.TRAQ_BOT_ID) {
  throw new Error('TRAQ_BOT_ID is not set');
}

export const TRAQ_BOT_ID = process.env.TRAQ_BOT_ID;
