import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { GENERATED_DIR } from "../common/fs";
import { Person, PERSON_FIELDS, PERSON_FIELDS_LIST } from "./person";
import { prettyStringify } from "../common/json";
import { Table } from "console-table-printer";
import { Case } from "change-case-all";
import { ChatCompletionSystemMessageParam } from "openai/src/resources/chat/completions";
import { FnImplementation } from "./implementation";
import { Filter } from "./functions/filter";
import { normalize } from "../common/strings";
import Predicate = Person.Predicate;
import { Add } from "./functions/add";
import { Edit } from "./functions/edit";
import { Remove } from "./functions/remove";

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
      new Add(this),
      new Edit(this),
      new Filter(this),
      new Remove(this)
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

  add(...persons: Person[]): void {
    this.items.push(...persons);
    this.store();
  }

  edit(edit: Person.Edit): boolean {
    const normalizedName = normalize(edit.fullName);
    const person = this.items.find(p => normalize(p.fullName) === normalizedName);
    if (!person) {
      return false;
    }
    if ('salary' in edit) {
      person.salary = edit.salary;
    }
    if ('occupation' in edit) {
      person.occupation = edit.occupation;
    }
    this.store();
    return true;
  }

  filter(filters: Filter.Input): Person[] {
    const predicates: Predicate[] = [
      filters?.fullNameLike ? (p: Person) => normalize(p.fullName).includes(normalize(filters.fullNameLike)) : null,
      filters?.minAge ? (p: Person) => p.age >= filters.minAge : null,
      filters?.maxAge ? (p: Person) => p.age <= filters.maxAge : null,
      filters?.isRightHanded ? (p: Person) => p.isRightHanded === filters.isRightHanded : null,
      filters?.occupation ? (p: Person) => normalize(p.occupation) === normalize(filters.occupation) : null,
      filters?.minSalary ? (p: Person) => p.salary >= filters.minSalary : null,
      filters?.maxSalary ? (p: Person) => p.salary <= filters.maxSalary : null,
    ]
      .filter(p => !!p);
    return this.items
      .filter(person => predicates.every(predicate => predicate(person)))
  }

  remove(fullName: string): boolean {
    const normalizedName = normalize(fullName);
    const index = this.items.findIndex(p => normalize(p.fullName) === normalizedName);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  // Private

  private store(): void {
    writeFileSync(REPOSITORY_PATH, prettyStringify(this.items), "utf-8");
  }

}