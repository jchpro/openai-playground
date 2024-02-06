
export class Param {

  constructor(
    readonly name: string,
    readonly type: string,
    readonly description: string,
    readonly required: boolean,
    readonly enumValues?: string[]
  ) { }

  toSchema(): Record<string, any> {
    return {
      type: this.type,
      description: this.description,
      enum: this.enumValues
    };
  }

}