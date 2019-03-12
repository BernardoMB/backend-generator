
import { Router } from 'express';
import { CatController } from '../controllers/CatController';

const router: Router = Router();

export class CatRoutes {

  public _catController: CatController;

  constructor() {
    this._catController = new CatController();	
  }

  routes(): Router {
    const controller = this._catController;
    router.post('', controller.create.bind(controller));
    router.get('', controller.read.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    return router;
  }
}  
