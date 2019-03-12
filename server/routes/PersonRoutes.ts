
import { Router } from 'express';
import { PersonController } from '../controllers/PersonController';

const router: Router = Router();

export class PersonRoutes {

  public _personController: PersonController;

  constructor() {
    this._personController = new PersonController();	
  }

  routes(): Router {
    const controller = this._personController;
    router.post('', controller.create.bind(controller));
    router.get('', controller.read.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    return router;
  }
}  
