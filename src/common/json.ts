import { ChatCompletion, ChatCompletionCreateParamsNonStreaming } from "openai/src/resources/chat/completions";
import { openai } from "./openai";

export async function createCompletionParseAsJson<T = any>(config: ChatCompletionCreateParamsNonStreaming): Promise<T | undefined> {
  let completion: ChatCompletion;
  try {
    completion = await openai.chat.completions.create(config);
  } catch (err) {
    console.error(err);
  }
  if (!completion) {
    console.warn('There was an error during the OpenAI API request.');
    return;
  }

  const json = completion.choices[0].message.content;
  let parsed: any;
  try {
    parsed = JSON.parse(json)
  } catch (err) {
    console.warn('Could not parse the received string as JSON, here\'s the original response');
    console.log(json);
    return;
  }
  return parsed;
}

export function prettyStringify(object: any): string {
  return JSON.stringify(object, null, 2);
}