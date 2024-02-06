import { ChatCompletionUserMessageParam } from "openai/resources";

export class Person {

  fullName: string = '';
  age: number = 0;
  isRightHanded: boolean = true;
  occupation: string = ''
  salary: number = 0;

  static fromObject(obj: any) {
    const person = new Person();
    PERSON_FIELDS.forEach(({name}) => {
      person[name as keyof typeof Person] = obj[name];
    });
    return person;
  }

}

export const HOW_MANY_PERSONS = 10;
export const HOW_MANY_OCCUPATIONS = 10;
export const PERSON_FIELDS = getPersonFields();
export const PERSON_FIELDS_LIST = PERSON_FIELDS.map(({name, type}) => `'${name}' (${type})`).join(', ');

export const PERSON_JSON_GENERATION_PROMPT: ChatCompletionUserMessageParam = {
  role: 'user',
  content: `Generate array with ${HOW_MANY_PERSONS} items, each containing information of a made-up person, with the following fields: ${PERSON_FIELDS_LIST}.`
  + ` Top-level object should have only one field "persons", and the generated items array should be stored there.`
  + ` Use the fixed set of ${HOW_MANY_OCCUPATIONS} occupations.`
};

export function morePersonsJsonGenerationPrompt(existingNames: string[]): ChatCompletionUserMessageParam {
  return {
    role: 'user',
    content: PERSON_JSON_GENERATION_PROMPT.content
      + ` You can't use these exact person names: ${existingNames.map(n => `"${n}"`).join(', ')}. You can reuse first names, but try to generate new ones, and always generate new last names.`
  };
}

function getPersonFields(): { name: string; type: string; }[] {
  const person = new Person();
  return Object.getOwnPropertyNames(person)
               .map(name => ({
                 name,
                 type: typeof person[name]
               }));
}
