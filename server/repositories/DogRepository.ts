
import { BaseRepository } from './base/BaseRepository';
import { DogModel } from '../data-access/models/DogModel';
import { IDog } from '../models/interfaces/IDog';

export class DogRepository extends BaseRepository<IDog> {
  
  constructor() {
    super(DogModel);
  }
  
}
