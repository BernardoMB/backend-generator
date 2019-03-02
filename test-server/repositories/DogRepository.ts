
import { RepositoryBase } from './interfaces/BaseRepository';
import { IDog } from '../models/interfaces/IDog';
import { DogSchema } from '..data-access/schemas/DogSchema';

export class DogRepository extends RepositoryBase<IDog> {
  
  constructor() {
    super(DogSchema);
  }
  
}
