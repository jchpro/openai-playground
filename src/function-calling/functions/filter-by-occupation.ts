import { FnImplementation } from "../implementation";
import { Repository } from "../repository";
import { Param } from "../param";

export class FilterByOccupation extends FnImplementation<void> {

  constructor(
    readonly repository: Repository
  ) {
    super(
      'filterByOccupation',
      'Filters the persons repository be provided occupation values.',
      [
        new Param(
          'occupations',
          'array',
          'Array of occupations, if more than one is provided any will match, meaning logical OR will used.',
          true,
          repository.getUniqueOccupations()
        )
      ]
    );
  }

  call({ occupations, occupation }: {
    occupations?: string[] | string;
    occupation?: string;
  }): void {
    const effective = occupations ?? occupation ?? [];
    const array = Array.isArray(effective) ? effective : [effective];
    const results = this.repository.filterByOccupation(array);
    console.log(`${results.length} filtered out results, no changes in the repository.`);
    if (results.length) {
      this.repository.printView(results);
    }
  }

}