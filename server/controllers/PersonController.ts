
import { BaseController } from './base/BaseController';
import { PersonBusiness } from '../businesses/PersonBusiness';
import { IPerson } from '../models/interfaces/IPerson';

export class PersonController extends BaseController<IPerson> {
  
  constructor() {
    super(new PersonBusiness());
  }
  
}
