
import { CatRepository } from '../repositories/CatRepository';
import { ICat } from '../models/interfaces/ICat';
import { IPerson } from './../models/interfaces/IPerson';
import { BaseBusiness } from './base/BaseBusiness';
    
export class CatBusiness extends BaseBusiness{
  
  public myProperty1: string;
    
  private myProperty2: Array<IPerson>;
    
  constructor() {
		super(new CatRepository());
  }

  /* async create(item: ICat): Promise<ICat> {
    return await this._catRepository.create(item);
  }
  
  async retrieve(): Promise<Array<ICat>> {
    const cats: Array<ICat> = await this._catRepository.retrieve();
    return cats;
  }
  
  async update(_id: string, item: ICat): Promise<ICat> {
    const cat = await this._catRepository.findById(_id);
    this.throwIfNotExists(cat);
    const updatedcat: ICat = await this._catRepository.update(cat._id, item);
    return updatedcat;
  }

  async delete(_id: string): Promise<boolean> {
    this.throwIfNotExists(await this._catRepository.delete(_id));
    return true;
  }
  
  async findById(_id: string): Promise<ICat> {
    const cat: ICat = await this._catRepository.findById(_id);
    this.throwIfNotExists(cat);
    return cat;
  }
  
  public throwIfNotExists(item: ICat) {
    if (!item) {
      throw { message: 'Cat not found', code: 404 };
    }
  } */

  public myFunction(myFirstArgument: Array<Date>, mySecondArgument: number): Promise<boolean> {
    throw new Error('myFunction not implemented in class CatController');
    return null;
  }
    
}
