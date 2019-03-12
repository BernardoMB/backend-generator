
import { DogRepository } from '../repositories/DogRepository';
import { IDog } from '../models/interfaces/IDog';
import { BaseBusiness } from './base/BaseBusiness';

export class DogBusiness extends BaseBusiness<IDog> {
  
  constructor() {
    super(new DogRepository());
  }

  
}
