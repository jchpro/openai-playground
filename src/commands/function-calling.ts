import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/src/resources/chat/completions";
import { getBaseChatConfig, JSON_MODE_SYSTEM_PROMPT } from "../common/chats";
import { createCompletionParseAsJson, prettyStringify } from "../common/json";
import { morePersonsJsonGenerationPrompt, Person, PERSON_JSON_GENERATION_PROMPT } from "../function-calling/person";
import { Repository } from "../function-calling/repository";
import { question } from "../common/readline";
import { openai } from "../common/openai";
import { ChatCompletionTool } from "openai/resources";

export async function functionCalling(options: {
  addMore?: boolean
}) {
  const repository = await loadRepositoryOrCreateNew();

  if (options.addMore) {
    console.log('Asking ChatGPT for more persons...');
    const morePersons = await generatePersonsData(repository);
    if (morePersons.length) {
      repository.add(...morePersons);
      console.log(`Added ${morePersons.length} items to the repository.`);
    }
  }
  repository.print();

  const exitTokens = ['quit', 'exit'];
  console.log('\nYou now have control over the repository via ChatGPT prompts. You can ask Chat to:');
  console.log('  - filter the data using various criteria (returns filtered data, doesn\'t alter the repository)');
  console.log('\nPlease note that in this example, Chat won\'t remember your previous actions and prompts, because each prompt is executed in separate context.');
  console.log(`Type ${exitTokens.map(it => `"${it}"`).join(' or ')} at any point to quit.`);

  while (true) {
    const userMessage = await question(`You: `);
    if (exitTokens.includes(userMessage)) {
      break;
    }

    const functions = repository.getFunctions();
    const tools: ChatCompletionTool[] = functions.map(f => ({
      type: 'function',
      function: f
    }));
    const response = await openai.chat.completions.create({
      ...getBaseChatConfig([
        repository.getInitialSystemPrompt(),
        {
          role: 'user',
          content: userMessage
        }
      ]),
      tools: tools,
      tool_choice: 'auto'
    });

    const message = response.choices[0].message;
    if (message.content) {
      console.log('ChatGPT: ' + message.content);
    }
    if (message.tool_calls?.[0]) {
      const call = message.tool_calls[0];
      if (call.type === 'function') {
        const fnName = call.function.name;
        let argsObj: any;
        try {
          argsObj = JSON.parse(call.function.arguments)
        } catch (e) {
          console.error('Could not parse function arguments returned by ChatGPT: ', call.function.arguments);
          continue;
        }

        const fn = functions.find(f => f.name === fnName);
        console.log(`System: calling ${fnName}()`);
        const result = await fn.call(argsObj);
        if (result) {
          console.log('System: function returned value:');
          console.log(prettyStringify(result));
        }
      }
    }
  }
}

async function loadRepositoryOrCreateNew() {
  const repository = new Repository();
  if (!repository.length) {
    console.log('Could not find the repository JSON file, asking ChatGPT to generate new data...');
    const newPersons = await generatePersonsData();
    if (!newPersons.length) {
      throw new Error('Failed to load repository');
    }
    repository.add(...newPersons);
  }
  return repository;
}

async function generatePersonsData(existingRepo?: Repository): Promise<Person[]> {
  const messages: ChatCompletionMessageParam[] = [
    JSON_MODE_SYSTEM_PROMPT,
    existingRepo ? morePersonsJsonGenerationPrompt(existingRepo.getAllNames()) : PERSON_JSON_GENERATION_PROMPT
  ];
  const config: ChatCompletionCreateParamsNonStreaming = getBaseChatConfig(messages);
  const items = await createCompletionParseAsJson<unknown>(config);
  if (Array.isArray(items)) {
    return items?.map(Person.fromObject) ?? [];
  }
  if (Array.isArray((items as object)?.['persons'])) {
    return items['persons'].map(Person.fromObject);
  }
  console.warn('ChatGPT returned invalid JSON object, please try again.');
  return [];
}

