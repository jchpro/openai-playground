import { FnImplementation } from "../implementation";
import { Repository } from "../repository";
import { Param } from "../param";
import { Person } from "../person";

export class Edit extends FnImplementation {

  constructor(
    readonly repository: Repository
  ) {
    super(
      'edit',
      'Edits fields of the person stored in the repository. Person has to be identified by the full name. ' +
      'Only occupation and salary can be edited, if user tries to edit something else, kindly inform that it\'s not possible. Function returns boolean representing if the operation was successful.',
      [
        new Param(
          'fullName',
          'string',
          'Full name of the person to edit, must match exactly.',
          true
        ),
        new Param(
          'occupation',
          'string',
          'New occupation of the person',
          false
        ),
        new Param(
          'salary',
          'integer',
          'New salary of the person.',
          false
        )
      ]
    );
  }

  call(input: Person.Edit): void | Promise<void> {
    this.logCall(input);
    const success = this.repository.edit(input);
    if (success) {
      console.log(`Successfully edited data of "${input.fullName}", stored new repository state.`);
      this.repository.print();
    } else {
      console.warn(`Editing data of "${input.fullName}" failed, it probably means that the person isn\'t stored in the repository.`);
    }
  }

}