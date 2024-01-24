import { ChatCompletionCreateParamsBase } from "openai/src/resources/chat/completions";

export const HOW_MANY_CITIES = 10;

export const STATIC_SEED = 42;
export const TEMPERATURE_FOR_CONSISTENCY = 0.1;

export const DEFAULT_CHAT_MODEL: ChatCompletionCreateParamsBase['model']
  = 'gpt-3.5-turbo';