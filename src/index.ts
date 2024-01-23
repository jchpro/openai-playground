import {configDotenv} from "dotenv";
import OpenAI from "openai";

configDotenv();

const openai = new OpenAI();

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Tell me in one sentence, what is parallax.' }],
    model: 'gpt-3.5-turbo',
    n: 1
  });
  console.log(chatCompletion);
  console.log(chatCompletion.choices[0]);
}

main();