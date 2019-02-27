
        import { Request, Response, NextFunction } from 'express';

        import { handleError } from './helps/handle-error';

        import { IBaseController } from './interfaces/base/BaseController';

        import { DogBusiness } from '../businesses/DogBusiness';
 
    

        export class DogController implements IBaseController<DogBusiness> {

        
            public create(req: Request, res: Response): void {
                try {
                  const dog: IDog = <IDog>req.body;
                  const dogBusiness = new DogBusiness();
                  dogBusiness.create(dog, (error, result) => {
                    if (error) {
                      console.error(error);
                      res.status(500).json({message: 'ERROR_CREATING[Dog]', error});
                    } else {
                      res.json({dog: result});
                    }
                  });
                } catch (error) {
                  console.error('Error creating Dog', error);
                  res.status(400).json({message: 'ERROR_CREATING[Dog]', error});
                }
            }

            public retrieve(req: Request, res: Response): void {
                try {
                    const dogBusiness = new DogBusiness();
                    dogBusiness.retrieve((error, result) => {
                        if (error) {
                            res.status(500).json({message: 'ERROR_RETRIEVING[Dog]', error});
                        } else {
                            res.json({cellsites: result});
                        }
                    });
                } catch (error) {
                    console.error('Error retrieving Dog', error);
                    res.status(400).json({message: 'ERROR_RETRIEVING[Dog]', error});
                }
            }

            public update(req: Request, res: Response): void {
                try {
                  const dog: IDog = <IDog>req.body;
                  const _id: string = req.params.id;
                  const dogBusiness = new DogBusiness();
                  dogBusiness.update(_id, dog, (error, result) => {
                    if (error) {
                      res.status(500).json({message: 'ERROR_UPDATING[Dog]', error});
                    }
                    if (!result) {
                      return res.status(404).json({
                        message: 'NOT_FOUND[Dog]',
                        error: new Error('Dog not found')
                      });
                    }
                    res.json({dog});
                  });
                } catch (error) {
                  console.error('Error updating Dog', error);
                  res.status(400).json({message: 'ERROR_UPDATING[Dog]', error});
                }
            }

            public delete(req: Request, res: Response): void {
                try {
                  const _id: string = req.params.id;
                  const dogBusiness = new DogBusiness();
                  dogBusiness.delete(_id, (error, result) => {
                    if (error) {
                        res.status(500).json({message: 'ERROR_DELETING[Dog]', error});
                    } else {
                        res.json({id: _id});
                    }
                  });
                } catch (error) {
                  console.error('Error deleting Dog', error);
                  res.status(500).json({message: 'ERROR_DELETING[Dog]', error});
                }
            }

            public findById(req: Request, res: Response): void {
                try {
                  const _id: string = req.params.id;
                  const dogBusiness = new DogBusiness();
                  dogBusiness.findById(_id, (error, result) => {
                    if (error) {
                      return res.status(500).json({message: 'ERROR_GETTING[Dog]', error});
                    }
                    if (!result) {
                        return res.status(404).json({
                          message: 'NOT_FOUND[Dog]', 
                          error: new Error('Dog not found')
                        });
                    }
                    res.json({Dog: result});
                  });
                } catch (error) {
                  console.error('Error getting Dog', error);
                  return res.status(400).json({message: 'ERROR_GETTING[Dog]', error});
                }
              }
    
}
