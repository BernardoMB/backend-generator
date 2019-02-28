
import { RepositoryBase } from './base/RepositoryBase';
import { IDog } from '../models/interfaces/IDog';
import { DogSchema } from '..data-access/schemas/DogSchema';

export class DogRepository extends RepositoryBase<IDog> {
  
  constructor() {
    super(DogSchema);
  }
  
}
