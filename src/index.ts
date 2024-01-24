import { Command } from "commander";
import { configDotenv } from "dotenv";
configDotenv();
import { chat } from "./commands/chat";

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

program.parseAsync()
       .catch(err => {
         console.error(err);
         process.exit(1);
       });
