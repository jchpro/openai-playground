import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { GENERATED_DIR } from "../common/fs";
import { Person, PERSON_FIELDS, PERSON_FIELDS_LIST } from "./person";
import { prettyStringify } from "../common/json";
import { Table } from "console-table-printer";
import { Case } from "change-case-all";
import { ChatCompletionSystemMessageParam } from "openai/src/resources/chat/completions";
import { FnImplementation } from "./implementation";
import { FilterByOccupation } from "./functions/filter-by-occupation";

const REPOSITORY_PATH = join(GENERATED_DIR, 'persons.json');

export class Repository {

  private readonly items: Person[];

  constructor() {
    try {
      const json = readFileSync(REPOSITORY_PATH, 'utf-8');
      const array: unknown = JSON.parse(json);
      if (Array.isArray(array)) {
        this.items = array.map(Person.fromObject);
      }
    } catch (e) {
      this.items = [];
    }
  }

  at(index: number): Person | undefined {
    return this.items[index];
  }

  add(...persons: Person[]): void {
    this.items.push(...persons);
    this.store();
  }

  get length(): number {
    return this.items.length;
  }

  print(): void {
    console.log(`${this.length} items in the repository.`);
    this.printView(this.items);
  }

  getAllNames(): string[] {
    return this.items.map(p => p.fullName);
  }

  getUniqueOccupations(): string[] {
    const set = new Set<string>();
    this.items.forEach(p => {
      set.add(p.occupation);
    });
    return Array.from(set);
  }

  getInitialSystemPrompt(): ChatCompletionSystemMessageParam {
    return {
      role: 'system',
      content: `You are an assistant which helps user view and manage repository of items with made-up persons data. Each person / item has following fields: ${PERSON_FIELDS_LIST}.`
        + ` When it comes to occupations, use exact enum values, correct users input to match the most appropriate one.`
        + ` Make assumptions, but always inform that you made them.`
    };
  }

  getFunctions(): FnImplementation[] {
    return [
      new FilterByOccupation(this)
    ];
  }

  printView(persons: Person[]) {
    const table = new Table({
      columns: PERSON_FIELDS.map(({ name }) => ({
        name,
        title: Case.sentence(Case.no(name))
      }))
    });
    persons.forEach(p => table.addRow(p));
    table.printTable();
  }

  // Functions callable by ChatGPT

  filterByOccupation(occupations: string[]): Person[] {
    const normalize = (str: string) => str.toLowerCase().trim();
    const or = occupations.map(normalize);
    return this.items
      .filter(p => or.includes(normalize(p.occupation)));
  }

  // Private

  private store(): void {
    writeFileSync(REPOSITORY_PATH, prettyStringify(this.items), "utf-8");
  }

}