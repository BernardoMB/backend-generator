
import { PersonRepository } from '../repositories/PersonRepository';
import { IPerson } from '../models/interfaces/IPerson';
import { BaseBusiness } from './base/BaseBusiness';

export class PersonBusiness extends BaseBusiness<IPerson> {
  
  constructor() {
    super(new PersonRepository());
  }

  
}
