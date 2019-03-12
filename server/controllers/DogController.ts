
import { BaseController } from './base/BaseController';
import { DogBusiness } from '../businesses/DogBusiness';
import { IDog } from '../models/interfaces/IDog';

export class DogController extends BaseController<IDog> {
  
  constructor() {
    super(new DogBusiness());
  }
  
}
