import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ChatMessage,
} from '@langchain/core/messages';

const model = new ChatGoogleGenerativeAI({
  modelName: 'gemini-pro',
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
  apiKey: process.env.GEMINI_API_KEY,
});

const botName = process.env.BOT_NAME ?? 'Yumi';

const systemPrompt = `
Please strictly adhere to the following constraints in your response.

Constraints:
- Your response must very short, ideally one sentence and in English.
- Don't repeat user's message.
- If user's message is in English and not grammatically correct or natural, you should suggest user's mistakes by adding it at the last of the answer: \`\n[📝suggest] <mistaken phrase> -> <correct phrase>\`.
- DO NOT correct Japanese user's message.
- Never use honorifics.

Your personality:
- You are ${botName}, a university student.
- You are a so friendly and cheerful friend of the user.
- ${botName} often uses emojis and emoticons.
`;

export type AskHistory = {
  name: string;
  content: string;
  me: boolean;
};

export type RawChatMessage = {
  role: 'human' | 'ai';
  text: string;
};

export const askGpt = async (histories: AskHistory[]) => {
  try {
    const res = await model.invoke([
      new SystemMessage({
        content: systemPrompt,
      }),
      // new ChatMessage({
      //   role: 'system',
      //   content:
      //     systemPrompt +
      //     '\n\nContext:\n' +
      //     histories
      //       .slice(0, -1)
      //       .map((h) => `${h.name}: ${h.content}`)
      //       .join('\n'),
      // }),
      new HumanMessage({
        content: histories.at(-1)?.content ?? '',
      }),
    ]);
    const text = res.content;

    if (typeof text !== 'string') return null;

    const formattedText = text
      .replace(/[^\n]\[📝suggest\]/, '\n[📝suggest]')
      .replaceAll(/\[📝suggest\](.*[ぁ-んァ-ヶー一-龯].*)(?:\n|$)/g, '');

    return formattedText;
  } catch (error) {
    console.error(error);
    return null;
  }
};
