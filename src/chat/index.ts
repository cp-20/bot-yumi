import type { WebSocket } from 'ws';
import type { Event } from './events';
import { createWSConnection, handleData, type DataHandlers } from './traq';

export class Chat {
  private ws: WebSocket;
  private handlers: DataHandlers;

  constructor(openHandler?: () => void) {
    this.ws = createWSConnection();
    this.handlers = {
      ERROR: (data) => {
        console.error(`Error from traQ server: ${data.body}`);
      },
    };

    this.ws.addEventListener('open', () => openHandler?.());

    this.ws.addEventListener('message', (e) => {
      try {
        const stringData = e.data.toString();
        const data = JSON.parse(stringData);

        const event = handleData(data, this.handlers);
        console.log(`received event: ${event.type}`);
      } catch (e) {
        console.error(e);
      }
    });
  }

  on<T extends Event['type']>(type: T, handler: Required<DataHandlers>[T]) {
    if (this.handlers[type]) {
      throw new Error(`Handler for ${type} is already registered`);
    }
    this.handlers[type] = handler;
  }

  async listen() {
    await new Promise((resolve) => {
      this.ws.addEventListener('open', () => resolve(0));
    });
    await new Promise((resolve) => {
      this.ws.addEventListener('close', () => {
        console.log('Connection closed');
        resolve(0);
      });
    });
  }
}
