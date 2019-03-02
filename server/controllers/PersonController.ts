
import { Request, Response, NextFunction } from 'express';
import { handleError } from './helps/handle-error';
import { IBaseController } from './interfaces/BaseController';
import { PersonBusiness } from '../businesses/PersonBusiness';
import { IPerson } from './../models/interfaces/IPerson';

export class PersonController implements IBaseController<PersonBusiness> {
  
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const person: IPerson = <IPerson>request.body;
      const personBusiness = new PersonBusiness();
      const createdPerson: IPerson = await personBusiness.create(person);
      response.status(200).json({ person: createdPerson });
    } catch (error) {
      handleError(error, 'Error creating person', next);
    }
  }

  public async retrieve(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const personBusiness = new PersonBusiness();
      const persons: Array<IPerson> = await personBusiness.retrieve();
      response.status(200).json({ persons: persons });
    } catch (error) {
      handleError(error, 'Error retrieving persons', next);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const newPerson: IPerson = <IPerson>request.body;
      const {
        params: { id }
      } = request;
      const personBusiness = new PersonBusiness();
      const updatedPerson: IPerson = await personBusiness.update(id, newPerson);
      response.status(201).json({ person: updatedPerson });
    } catch (error) {
      handleError(error, ' Error updating person', next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const personBusiness = new PersonBusiness();
      await personBusiness.delete(id);
      response.status(200).json({ id });
    } catch (error) {
      handleError(error, ' Error deleting person', next);
    }
  }

  public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const personBusiness = new PersonBusiness();
      const person: IPerson = await personBusiness.findById(id);
      response.status(200).json({ person: person });
    } catch (error) {
      handleError(error, 'Error finding person', next);
    }
  }

  
}
