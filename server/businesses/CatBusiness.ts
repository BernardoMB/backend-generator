
import { CatRepository } from '../repositories/CatRepository';
import { ICat } from '../models/interfaces/ICat';
import { BaseBusiness } from './base/BaseBusiness';
import { IPerson } from './../models/interfaces/IPerson';
    
export class CatBusiness extends BaseBusiness<ICat> {
  
  public myProperty1: string;
    
  private myProperty2: Array<IPerson>;
    
  constructor() {
    super(new CatRepository());
  }

  public myFunction(myFirstArgument: Array<Date>, mySecondArgument: number): Promise<boolean> {
    throw new Error('myFunction not implemented in class CatController');
    return null;
  }
    
}
