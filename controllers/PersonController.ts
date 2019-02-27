
        import { Request, Response, NextFunction } from 'express';

        import { handleError } from './helps/handle-error';

        import { IBaseController } from './interfaces/base/BaseController';

        import { PersonBusiness } from '../businesses/PersonBusiness';
 
    

        export class PersonController implements IBaseController<PersonBusiness> {

        
            public create(req: Request, res: Response): void {
                try {
                  const person: IPerson = <IPerson>req.body;
                  const personBusiness = new PersonBusiness();
                  personBusiness.create(person, (error, result) => {
                    if (error) {
                      console.error(error);
                      res.status(500).json({message: 'ERROR_CREATING[Person]', error});
                    } else {
                      res.json({person: result});
                    }
                  });
                } catch (error) {
                  console.error('Error creating Person', error);
                  res.status(400).json({message: 'ERROR_CREATING[Person]', error});
                }
            }

            public retrieve(req: Request, res: Response): void {
                try {
                    const personBusiness = new PersonBusiness();
                    personBusiness.retrieve((error, result) => {
                        if (error) {
                            res.status(500).json({message: 'ERROR_RETRIEVING[Person]', error});
                        } else {
                            res.json({cellsites: result});
                        }
                    });
                } catch (error) {
                    console.error('Error retrieving Person', error);
                    res.status(400).json({message: 'ERROR_RETRIEVING[Person]', error});
                }
            }

            public update(req: Request, res: Response): void {
                try {
                  const person: IPerson = <IPerson>req.body;
                  const _id: string = req.params.id;
                  const personBusiness = new PersonBusiness();
                  personBusiness.update(_id, person, (error, result) => {
                    if (error) {
                      res.status(500).json({message: 'ERROR_UPDATING[Person]', error});
                    }
                    if (!result) {
                      return res.status(404).json({
                        message: 'NOT_FOUND[Person]',
                        error: new Error('Person not found')
                      });
                    }
                    res.json({person});
                  });
                } catch (error) {
                  console.error('Error updating Person', error);
                  res.status(400).json({message: 'ERROR_UPDATING[Person]', error});
                }
            }

            public delete(req: Request, res: Response): void {
                try {
                  const _id: string = req.params.id;
                  const personBusiness = new PersonBusiness();
                  personBusiness.delete(_id, (error, result) => {
                    if (error) {
                        res.status(500).json({message: 'ERROR_DELETING[Person]', error});
                    } else {
                        res.json({id: _id});
                    }
                  });
                } catch (error) {
                  console.error('Error deleting Person', error);
                  res.status(500).json({message: 'ERROR_DELETING[Person]', error});
                }
            }

            public findById(req: Request, res: Response): void {
                try {
                  const _id: string = req.params.id;
                  const personBusiness = new PersonBusiness();
                  personBusiness.findById(_id, (error, result) => {
                    if (error) {
                      return res.status(500).json({message: 'ERROR_GETTING[Person]', error});
                    }
                    if (!result) {
                        return res.status(404).json({
                          message: 'NOT_FOUND[Person]', 
                          error: new Error('Person not found')
                        });
                    }
                    res.json({Person: result});
                  });
                } catch (error) {
                  console.error('Error getting Person', error);
                  return res.status(400).json({message: 'ERROR_GETTING[Person]', error});
                }
              }
    
}
