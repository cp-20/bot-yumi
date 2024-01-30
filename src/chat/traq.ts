import { TRAQ_BOT_ID } from '../env';
import { api } from '../gateways';
import { EventSchema, type Event } from './events';
import { WebSocket } from 'ws';

const accessToken = process.env.TRAQ_ACCESS_TOKEN;

export const createWSConnection = () =>
  new WebSocket(`wss://q.trap.jp/api/v3/bots/ws`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export type DataHandlers = Partial<{
  [event in Event as event['type']]: (data: event) => void;
}>;

export const handleData = (data: unknown, handlers: DataHandlers) => {
  const event = EventSchema.parse(data);

  const handler = handlers[event.type] as (data: Event) => void;

  handler?.(event);

  return event;
};

const users = await api.users.getUsers().then((res) => res.data);

export type ChatHistory = {
  name: string;
  content: string;
};

export const getChannelChatHistories = async (channelId: string) => {
  const res = await api.channels.getMessages(channelId, { limit: 5 });
  if (!res.ok) return null;

  const channelMessages = res.data;
  const histories = channelMessages.map((message) => ({
    name:
      users.find((user) => user.id === message.userId)?.displayName ??
      message.userId,
    content: message.content,
    me: message.userId === TRAQ_BOT_ID,
  }));
  return histories;
};
