import { Client } from 'traq-bot-ts';
import { TRAQ_BOT_ID, TRAQ_ACCESS_TOKEN } from './env';
import { api } from './gateways';
import { askGpt } from './gpt';

const client = new Client({ token: TRAQ_ACCESS_TOKEN, debug: true });

client.on('MESSAGE_CREATED', async (data) => {
  const { message } = data.body;
  const response = await askGpt([
    {
      name: message.user.displayName,
      content: message.plainText,
      me: message.user.id === TRAQ_BOT_ID,
    },
  ]);

  if (response === null) return;

  if (response.includes('[📝suggest]') || Math.random() < 0.2) {
    await api.channels.postMessage(message.channelId, {
      content: response,
    });
  }
});

await client.listen(() => console.log('connected'));
