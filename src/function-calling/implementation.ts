import { FnDefinition } from "./definition";

export abstract class FnImplementation<T = any> extends FnDefinition {

  abstract call(input: any): T | Promise<T>;

}