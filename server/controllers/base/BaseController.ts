
import { Request, Response, NextFunction } from 'express';
import { handleError } from './../helps/handle-error';
import { IReadController } from '../interfaces/ReadController';
import { IWriteController } from '../interfaces/WriteController';

export class BaseController<T> implements IReadController<T>, IWriteController<T> {
  
  public _business;
  
  constructor(business) {
    this._business = business;
  }

  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const item: T = <T>request.body;
      const createdItem: T = await this._business.create(item);
      response.status(201).json({ item: createdItem });
    } catch (error) {
      handleError(error, 'Error creating item', next);
    }
  }
  
  public async read(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const items: Array<T> = await this._business.read();
      response.status(200).json({ items });
    } catch (error) {
      handleError(error, 'Error retrieving cats', next);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const newItem: T = <T>request.body;
      const {
        params: { id }
      } = request;
      const updatedItem: T = await this._business.update(id, newItem);
      response.status(202).json({ item: updatedItem });
    } catch (error) {
      handleError(error, ' Error updating cat', next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      await this._business.delete(id);
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
      const item: T = await this._business.findById(id);
      response.status(200).json({ item });
    } catch (error) {
      handleError(error, 'Error finding cat', next);
    }
  }

}
  