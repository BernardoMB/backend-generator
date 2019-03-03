import { BaseRepository } from './base/BaseRepository';
import { catSchema } from '../data-access/schemas/CatSchema';
import { ICat } from '../models/interfaces/ICat';

export class CatRepository extends BaseRepository<ICat> {
  
  constructor() {
    super(catSchema);
	}
  
}
