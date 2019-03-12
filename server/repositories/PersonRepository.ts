
import { BaseRepository } from './base/BaseRepository';
import { PersonModel } from '../data-access/models/PersonModel';
import { IPerson } from '../models/interfaces/IPerson';

export class PersonRepository extends BaseRepository<IPerson> {
  
  constructor() {
    super(PersonModel);
  }
  
}
