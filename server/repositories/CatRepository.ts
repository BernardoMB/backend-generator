
import { RepositoryBase } from './base/RepositoryBase';
import { ICat } from '../models/interfaces/ICat';
import { CatSchema } from '..data-access/schemas/CatSchema';

export class CatRepository extends RepositoryBase<ICat> {
  
  constructor() {
    super(CatSchema);
  }
  
}
