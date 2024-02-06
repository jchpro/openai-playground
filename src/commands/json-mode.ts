import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/src/resources/chat/completions";
import { getBaseChatConfig, JSON_MODE_SYSTEM_PROMPT } from "../common/chats";
import { HOW_MANY_CITIES, STATIC_SEED, TEMPERATURE_FOR_CONSISTENCY } from "../common/config";
import { createCompletionParseAsJson } from "../common/json";

export async function jsonMode(country: string) {
  const messages: ChatCompletionMessageParam[] = [
    JSON_MODE_SYSTEM_PROMPT,
    {
      role: 'user',
      content: `Respond with the JSON file containing a simple object, keys of which will be names of ${HOW_MANY_CITIES} largest cities of ${country}, and values their respective populations (integer). Names of the cities should be in written in English, or at least anglicized if that's possible.`
    }
  ];
  const config: ChatCompletionCreateParamsNonStreaming = {
    ...getBaseChatConfig(messages),
    seed: STATIC_SEED,
    temperature: TEMPERATURE_FOR_CONSISTENCY
  };

  console.log(`Getting JSON object with ${HOW_MANY_CITIES} cities of ${country} and their populations...`);

  const parsed = await createCompletionParseAsJson<Record<string, number>>(config);
  if (!parsed) {
    return;
  }

  console.log('Here\'s the received response, formatted by Node:');
  console.log(parsed);

  const sum = Object.values(parsed).reduce((acc, next) => acc + next, 0);
  if (isFinite(sum)) {
    console.log(`Values of the object sum up to the finite value of ${sum}, so the returned object makes sense!`);
  } else {
    console.log(`Values of the object sum up to some nonsense: ${sum}, not sure what's that about...`);
  }
}

