import OpenAI from "openai";
import { ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/src/resources/chat/completions";
import { HOW_MANY_CITIES, STATIC_SEED, TEMPERATURE_FOR_CONSISTENCY } from "../common/config";
import { getBaseChatConfig } from "../common/chats";

const openai = new OpenAI();

export async function jsonMode(country: string) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant, designed to output the response in JSON format.',
    },
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

  let completion: ChatCompletion;
  try {
    completion = await openai.chat.completions.create(config);
  } catch (err) {
    console.error(err);
  }
  if (!completion) {
    console.warn('There was an error during the API request.');
    return;
  }

  const json = completion.choices[0].message.content;
  let parsed: Record<string, number>;
  try {
    parsed = JSON.parse(json)
  } catch (err) {
    console.warn('Could not parse the received string as JSON, here\'s the original response');
    console.log(json);
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

