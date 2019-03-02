import { BaseRepository } from './base/BaseRepository';
import { catSchema } from '../data-access/schemas/CatSchema';

export class CatRepository extends BaseRepository<any> {
  
  constructor() {
    super(catSchema);
	}
  
}
