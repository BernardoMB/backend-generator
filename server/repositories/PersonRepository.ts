
import { RepositoryBase } from './base/RepositoryBase';
import { IPerson } from '../models/interfaces/IPerson';
import { PersonSchema } from '..data-access/schemas/PersonSchema';

export class PersonRepository extends RepositoryBase<IPerson> {
  
  constructor() {
    super(PersonSchema);
  }
  
}
