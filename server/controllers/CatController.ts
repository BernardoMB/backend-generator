import { CatBusiness } from '../businesses/CatBusiness';
import { IPerson } from './../models/interfaces/IPerson';
import { BaseController } from './base/BaseController';
		
// Todo: implement insterfaces

export class CatController extends BaseController /* implements IBaseController<CatBusiness> */ {
  
  public myProperty1: string;
    
	private myProperty2: Array<IPerson>;

	constructor(catBusiness: CatBusiness) {
		super(catBusiness);
	}
    
  /* public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const cat: ICat = <ICat>request.body;
      const catBusiness = new CatBusiness();
      const createdCat: ICat = await catBusiness.create(cat);
      response.status(200).json({ cat: createdCat });
    } catch (error) {
      handleError(error, 'Error creating cat', next);
    }
  }

  public async retrieve(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const catBusiness = new CatBusiness();
      const cats: Array<ICat> = await catBusiness.retrieve();
      response.status(200).json({ cats: cats });
    } catch (error) { 
      handleError(error, 'Error retrieving cats', next);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const newCat: ICat = <ICat>request.body;
      const {
        params: { id }
      } = request;
      const catBusiness = new CatBusiness();
      const updatedCat: ICat = await catBusiness.update(id, newCat);
      response.status(201).json({ cat: updatedCat });
    } catch (error) {
      handleError(error, ' Error updating cat', next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const catBusiness = new CatBusiness();
      await catBusiness.delete(id);
      response.status(200).json({ id });
    } catch (error) {
      handleError(error, ' Error deleting cat', next);
    }
  }

  public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const catBusiness = new CatBusiness();
      const cat: ICat = await catBusiness.findById(id);
      response.status(200).json({ cat: cat });
    } catch (error) {
      handleError(error, 'Error finding cat', next);
    }
  } */

  public myFunction(myFirstArgument: Array<Date>, mySecondArgument: number): Promise<boolean> {
    throw new Error('myFunction not implemented in class CatController');
    return null;
  }
    
}
