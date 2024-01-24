import OpenAI from "openai";
import { ChatCompletion } from "openai/resources";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions";
import { question } from "../common/readline";
import { getBaseChatConfig } from "../common/chats";

const openai = new OpenAI();

export async function chat(options: {
  readonly name?: string;
  readonly stream?: boolean;
}) {
  const exitTokens = ['quit', 'exit'];
  const systemMessage = getSystemMessage(options.name);
  const username = options.name ?? 'You';
  const messageHistory: ChatCompletionMessageParam[] = [{
    role: 'system',
    content: systemMessage
  }];

  console.log(`You conversion with ChatGPT starts. Type ${exitTokens.map(it => `"${it}"`).join(' or ')} at any point to quit.`);

  while (true) {
    const userMessage = await question(`${username}: `);
    if (exitTokens.includes(userMessage)) {
      break;
    }

    messageHistory.push({
      role: 'user',
      content: userMessage
    });

    if (options.stream) {
      let message: string = '';
      console.log('ChatGPT:')
      await streamChatCompletion(messageHistory, (delta) => {
        process.stdout.write(delta);
        message += delta;
      });
      messageHistory.push({
        role: 'assistant',
        content: message
      });
      process.stdout.write('\n');
    } else {
      const chatCompletion = await getChatCompletion(messageHistory);
      if (!chatCompletion) {
        console.warn(`ChatGPT: Request to OpenAI failed, you can try again if you'd like.`);
        continue;
      }
      const assistantMessage = chatCompletion.choices[0].message;
      messageHistory.push(assistantMessage);
      console.log(`ChatGPT: ${assistantMessage.content}`);
    }
  }

  console.log('Exiting, bye!');
}

async function getChatCompletion(messages: ChatCompletionMessageParam[]): Promise<ChatCompletion | undefined> {
  try {
    return await openai.chat.completions.create(getBaseChatConfig(messages));
  } catch (err) {
    console.error(err);
  }
}

async function streamChatCompletion(messages: ChatCompletionMessageParam[], chunkCallback: (delta: string) => void) {
  try {
    const stream = await openai.chat.completions.create({
      ...getBaseChatConfig(messages),
      stream: true
    });
    for await (const chunk of stream) {
      chunkCallback(chunk.choices[0].delta.content || '');
    }
  } catch (err) {
    console.error(err);
  }
}

function getSystemMessage(userName?: string): string {
  return [
    'You are a casual conversation companion.',
    userName ? `The user's you will be talking to name is ${userName}.` : undefined,
    'Limit the length of your answers to 3 sentences maximum.'
  ]
    .filter(it => !!it)
    .join(' ')
}

