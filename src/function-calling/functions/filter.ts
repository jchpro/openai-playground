import { FnImplementation } from "../implementation";
import { Repository } from "../repository";
import { Param } from "../param";

export class Filter extends FnImplementation {

  constructor(
    readonly repository: Repository
  ) {
    super(
      'filter',
      'Filters the persons repository be provided criteria, doesn\'t change the repository state, just displays the matching persons.',
      [
        new Param(
          'fullNameLike',
          'string',
          'String to find in the full name of the person, doesn\'t have to be exact match.',
          false
        ),
        new Param(
          'minAge',
          'integer',
          'Minimum age of the person.',
          false
        ),
        new Param(
          'maxAge',
          'integer',
          'Maximum age of the person.',
          false
        ),
        new Param(
          'isRightHanded',
          'boolean',
          'Whether a person is right handed or not.',
          false
        ),
        new Param(
          'occupation',
          'string',
          'Occupation of the person, must be exact enum value.',
          false,
          repository.getUniqueOccupations()
        ),
        new Param(
          'minSalary',
          'integer',
          'Minimum salary of the person.',
          false
        ),
        new Param(
          'maxSalary',
          'integer',
          'Maximum salary of the person.',
          false
        )
      ]
    );
  }

  call(input: Filter.Input): void {
    this.logCall(input);
    const results = this.repository.filter(input);
    console.log(`${results.length} filtered out results, no changes in the repository.`);
    if (results.length) {
      this.repository.printView(results);
    }
  }

}

export namespace Filter {

  export interface Input {
    fullNameLike?: string;
    isRightHanded?: boolean;
    minAge?: number;
    maxAge?: number;
    occupation?: string;
    minSalary?: number;
    maxSalary?: number;
  }

}