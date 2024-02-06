import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from "openai/src/resources/chat/completions";
import { DEFAULT_CHAT_MODEL } from "./config";

export const JSON_MODE_SYSTEM_PROMPT: ChatCompletionSystemMessageParam = {
  role: 'system',
  content: 'You are a helpful assistant, designed to output the response in JSON format.',
};

export function getBaseChatConfig(messages: ChatCompletionMessageParam[]) {
  return {
    messages,
    model: DEFAULT_CHAT_MODEL,
    n: 1,
  };
}
