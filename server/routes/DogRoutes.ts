
import { Router } from 'express';
import { DogController } from '../controllers/DogController';

const router: Router = Router();

export class DogRoutes {

  public _dogController: DogController;

  constructor() {
    this._dogController = new DogController();	
  }

  routes(): Router {
    const controller = this._dogController;
    router.post('', controller.create.bind(controller));
    router.get('', controller.read.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    return router;
  }
}  
