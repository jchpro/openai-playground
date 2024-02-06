import { Command } from "commander";
import { configDotenv } from "dotenv";
configDotenv();
import { chat } from "./commands/chat";
import { functionCalling } from "./commands/function-calling";
import { jsonMode } from "./commands/json-mode";
import { done } from "./common/readline";

if (!process.env.OPENAI_API_KEY) {
  throw '"OPENAI_API_KEY" environment variable is not defined';
}

const program = new Command()
  .name('OpenAI API playground')
  .description('Messing around with OpenAI API');

program
  .command('chat')
  .description(`Let's you chat with ChatGPT from the command line.`)
  .option('-n, --name <your_name>', 'Your name, will be provided to ChatGPT before your conversation.')
  .option('-s, --stream', 'Will print the response as soon as the chunks come from the API, instead of displaying entire response at once.')
  .action(chat);

program
  .command('jsonMode')
  .description('Returns output in JSON format. For a provided `country`, model should return object with keys being names of the biggest cities of that country, and values their populations. By setting the same `seed` and `temperature` in each request, the output should be always the same for a given country.')
  .argument('country', 'Name of the country')
  .action(jsonMode);

program
  .command('fnCalling')
  .description('Demonstrates function calling capability. As first step, chat generates a very simple "repository" containing made-up persons data using JSON mode. Then you can do some stuff with that data, like filter it in some way, or output it in some other format, using chat interface instead of manually running commands.')
  .option('-a, --addMore', 'If set, each time you load the repository from JSON file, new batch of persons will be added. Please note that the array of already added person names will be appended to the prompt, so this can cost you many tokens.')
  .action(functionCalling)

program.parseAsync()
  .then(() => {
    done();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
