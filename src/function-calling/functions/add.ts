import { FnImplementation } from "../implementation";
import { Param } from "../param";
import { Person } from "../person";
import { Repository } from "../repository";

export class Add extends FnImplementation {

  constructor(
    readonly repository: Repository
  ) {
    super(
      'add',
      'Adds a new person to the repository and stores it permanently. ' +
      'If user doesn\'t provide some of the required information about the person, assign it randomly but inform the user about it.',
      [
        new Param(
          'fullName',
          'string',
          'Full name of the person.',
          true
        ),
        new Param(
          'age',
          'integer',
          'Age of the person.',
          true
        ),
        new Param(
          'isRightHanded',
          'boolean',
          'Is that person right handed? We can assume that it is, like most of the population.',
          false
        ),
        new Param(
          'occupation',
          'string',
          'Occupation of the person',
          true
        ),
        new Param(
          'salary',
          'integer',
          'Salary of the person.',
          true
        )
      ]
    );
  }

  call(input: Omit<Person, 'isRightHanded'> & {
    isRightHanded?: boolean;
  }): void {
    this.logCall(input);
    const person = Person.fromObject({
      isRightHanded: true,
      ...input
    });
    this.repository.add(person);
    console.log(`Added "${person.fullName}" to the repository permanently.`);
    this.repository.print();
  }

}