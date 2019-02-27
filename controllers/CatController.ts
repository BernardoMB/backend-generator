
        import { Request, Response, NextFunction } from 'express';

        import { handleError } from './helps/handle-error';

        import { IBaseController } from './interfaces/base/BaseController';

        import { CatBusiness } from '../businesses/CatBusiness';
 
    

        export class CatController implements IBaseController<CatBusiness> {

        
            public create(req: Request, res: Response): void {
                try {
                  const cat: ICat = <ICat>req.body;
                  const catBusiness = new CatBusiness();
                  catBusiness.create(cat, (error, result) => {
                    if (error) {
                      console.error(error);
                      res.status(500).json({message: 'ERROR_CREATING[Cat]', error});
                    } else {
                      res.json({cat: result});
                    }
                  });
                } catch (error) {
                  console.error('Error creating Cat', error);
                  res.status(400).json({message: 'ERROR_CREATING[Cat]', error});
                }
            }

            public retrieve(req: Request, res: Response): void {
                try {
                    const catBusiness = new CatBusiness();
                    catBusiness.retrieve((error, result) => {
                        if (error) {
                            res.status(500).json({message: 'ERROR_RETRIEVING[Cat]', error});
                        } else {
                            res.json({cellsites: result});
                        }
                    });
                } catch (error) {
                    console.error('Error retrieving Cat', error);
                    res.status(400).json({message: 'ERROR_RETRIEVING[Cat]', error});
                }
            }

            public update(req: Request, res: Response): void {
                try {
                  const cat: ICat = <ICat>req.body;
                  const _id: string = req.params.id;
                  const catBusiness = new CatBusiness();
                  catBusiness.update(_id, cat, (error, result) => {
                    if (error) {
                      res.status(500).json({message: 'ERROR_UPDATING[Cat]', error});
                    }
                    if (!result) {
                      return res.status(404).json({
                        message: 'NOT_FOUND[Cat]',
                        error: new Error('Cat not found')
                      });
                    }
                    res.json({cat});
                  });
                } catch (error) {
                  console.error('Error updating Cat', error);
                  res.status(400).json({message: 'ERROR_UPDATING[Cat]', error});
                }
            }

            public delete(req: Request, res: Response): void {
                try {
                  const _id: string = req.params.id;
                  const catBusiness = new CatBusiness();
                  catBusiness.delete(_id, (error, result) => {
                    if (error) {
                        res.status(500).json({message: 'ERROR_DELETING[Cat]', error});
                    } else {
                        res.json({id: _id});
                    }
                  });
                } catch (error) {
                  console.error('Error deleting Cat', error);
                  res.status(500).json({message: 'ERROR_DELETING[Cat]', error});
                }
            }

            public findById(req: Request, res: Response): void {
                try {
                  const _id: string = req.params.id;
                  const catBusiness = new CatBusiness();
                  catBusiness.findById(_id, (error, result) => {
                    if (error) {
                      return res.status(500).json({message: 'ERROR_GETTING[Cat]', error});
                    }
                    if (!result) {
                        return res.status(404).json({
                          message: 'NOT_FOUND[Cat]', 
                          error: new Error('Cat not found')
                        });
                    }
                    res.json({Cat: result});
                  });
                } catch (error) {
                  console.error('Error getting Cat', error);
                  return res.status(400).json({message: 'ERROR_GETTING[Cat]', error});
                }
              }
    
}
