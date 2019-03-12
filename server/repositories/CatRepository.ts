
import { BaseRepository } from './base/BaseRepository';
import { CatModel } from '../data-access/models/CatModel';
import { ICat } from '../models/interfaces/ICat';

export class CatRepository extends BaseRepository<ICat> {
  
  constructor() {
    super(CatModel);
  }
  
}
