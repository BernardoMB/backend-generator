
import { CatRepository } from '../repository/CatRepository';
import { ICatBusiness } from './interfaces/ICatBusiness';
import { ICat } from '../models/interfaces/ICat';import { IPerson } from './../model/interfaces/IPerson';
    
export class CatBusiness implements ICatBusiness {
  
  public myProperty1: string;
    
  private myProperty2: Array<IPerson>;
    
  private _catRepository: CatRepository;
  
  constructor() {
    this._catRepository = new CatRepository();
  }

  async create(item: ICat): Promise<ICat> {
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
  
  throwIfNotExists(item: ICat) {
    if (!item) {
      throw { message: 'Cat not found', code: 404 };
    }
  }
  public myFunction(myFirstArgument: Array<Date>, mySecondArgument: number): Promise<boolean> {
    throw new Error('myFunction not implemented in class CatController');
    return null;
  }
    
}
