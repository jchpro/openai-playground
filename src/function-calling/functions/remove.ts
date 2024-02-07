import { FnImplementation } from "../implementation";
import { Repository } from "../repository";
import { Param } from "../param";
import { Person } from "../person";

export class Remove extends FnImplementation {

  constructor(
    readonly repository: Repository
  ) {
    super(
      'remove',
      'Removes person from the repository permanently. Person has to be identified by the full name. No extra confirmation from the user is required. Function returns boolean representing if the operation was successful.',
      [
        new Param(
          'fullName',
          'string',
          'Full name of the person to remove, must match exactly.',
          true
        ),
      ]
    );
  }

  call(input: Pick<Person, 'fullName'>): void | Promise<void> {
    this.logCall(input);
    const success = this.repository.remove(input.fullName);
    if (success) {
      console.log(`Successfully removed "${input.fullName}" from the repository permanently.`);
      this.repository.print();
    } else {
      console.warn(`Removing data of "${input.fullName}", it probably means that the person isn\'t stored in the repository.`);
    }
  }

}