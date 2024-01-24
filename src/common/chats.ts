import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions";
import { DEFAULT_CHAT_MODEL } from "./config";

export function getBaseChatConfig(messages: ChatCompletionMessageParam[]) {
  return {
    messages,
    model: DEFAULT_CHAT_MODEL,
    n: 1,
  };
}