import { BaseController } from './base/BaseController';
import { CatBusiness } from '../businesses/CatBusiness';
import { ICat } from '../models/interfaces/ICat';

import { IPerson } from './../models/interfaces/IPerson';

export class CatController extends BaseController<ICat> {

  public myProperty1: string;

  private myProperty2: Array<IPerson>;

  constructor() {
    super(new CatBusiness());
  }
  public myFunction(myFirstArgument: Array<Date>, mySecondArgument: number): Promise<boolean> {
    throw new Error('myFunction not implemented in class CatController');
    return null;
  }

}
