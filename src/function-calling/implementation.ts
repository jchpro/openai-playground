import { FnDefinition } from "./definition";
import { prettyStringify } from "../common/json";

export abstract class FnImplementation extends FnDefinition {

  abstract call(input: any): void | Promise<void>;

  protected logCall(input: Record<string, any>): void {
    console.log(`Function call: ${this.getCallSignature(input)}`);
  }

  protected logReturn(value: any): void {
    console.log(`Returned: `);
    console.log(prettyStringify(value));
  }

  private getCallSignature(input: Record<string, any>): string {
    const paramsWithValues: string[] = [];
    this.params.forEach(param => {
      if (param.name in input) {
        paramsWithValues.push(`${param.name} = ${input[param.name]}`);
      }
    });
    return `${this.name}(${paramsWithValues.join(', ')})`;
  }

}