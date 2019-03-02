import { Request, Response, NextFunction } from 'express';
import { handleError } from './../helps/handle-error';
import { BaseBusiness } from '../../businesses/base/BaseBusiness';

export abstract class BaseController {

	protected _business: BaseBusiness;

	constructor(business: BaseBusiness) {
		this._business = business;
	}

	public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
			// TODO: Cast request body with generic type.		
			const item = request.body;
			// TODO: specifiy type of created item.
      const createdItem = await this._business.create(item);
      response.status(200).json({ item: createdItem });
    } catch (error) {
      handleError(error, 'Error creating item', next);
    }
  }

  public async retrieve(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
			// TODO: specifiy type of items.
			const items = await this._business.retrieve();
      response.status(200).json({ items });
    } catch (error) {
      handleError(error, 'Error retrieving cats', next);
    }
  }


	// TODO: update methods below


  /* public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
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
  }

  public myFunction(myFirstArgument: Array<Date>, mySecondArgument: number): Promise<boolean> {
    throw new Error('myFunction not implemented in class CatController');
    return null;
  } */
}