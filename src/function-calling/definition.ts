import { Param } from "./param";
import { FunctionDefinition } from "openai/src/resources/shared";

export class FnDefinition {

  constructor(
    readonly name: string,
    readonly description: string,
    readonly params: Param[]
  ) { }

  toDefinition(): FunctionDefinition {
    const parameters: Record<string, any> = {};
    this.params.forEach(p => {
      parameters[p.name] = p.toSchema()
    });
    return {
      name: this.name,
      description: this.description,
      parameters: {
        type: 'object',
        properties: parameters,
        required: this.params
          .filter(p => p.required)
          .map(p => p.name)
      },
    };
  }

}