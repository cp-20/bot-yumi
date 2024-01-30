import { Chat } from './chat';
import { TRAQ_BOT_ID } from './env';
import { api } from './gateways';
import { askGpt } from './gpt';

const chat = new Chat(() => console.log('connected'));

chat.on('MESSAGE_CREATED', async (data) => {
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

await chat.listen();
