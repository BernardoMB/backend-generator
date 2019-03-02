
import { Request, Response, NextFunction } from 'express';
import { handleError } from './helps/handle-error';
import { IBaseController } from './interfaces/BaseController';
import { DogBusiness } from '../businesses/DogBusiness';
import { IDog } from './../models/interfaces/IDog';

export class DogController implements IBaseController<DogBusiness> {
  
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const dog: IDog = <IDog>request.body;
      const dogBusiness = new DogBusiness();
      const createdDog: IDog = await dogBusiness.create(dog);
      response.status(200).json({ dog: createdDog });
    } catch (error) {
      handleError(error, 'Error creating dog', next);
    }
  }

  public async retrieve(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const dogBusiness = new DogBusiness();
      const dogs: Array<IDog> = await dogBusiness.retrieve();
      response.status(200).json({ dogs: dogs });
    } catch (error) {
      handleError(error, 'Error retrieving dogs', next);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const newDog: IDog = <IDog>request.body;
      const {
        params: { id }
      } = request;
      const dogBusiness = new DogBusiness();
      const updatedDog: IDog = await dogBusiness.update(id, newDog);
      response.status(201).json({ dog: updatedDog });
    } catch (error) {
      handleError(error, ' Error updating dog', next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const dogBusiness = new DogBusiness();
      await dogBusiness.delete(id);
      response.status(200).json({ id });
    } catch (error) {
      handleError(error, ' Error deleting dog', next);
    }
  }

  public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const dogBusiness = new DogBusiness();
      const dog: IDog = await dogBusiness.findById(id);
      response.status(200).json({ dog: dog });
    } catch (error) {
      handleError(error, 'Error finding dog', next);
    }
  }

  
}
