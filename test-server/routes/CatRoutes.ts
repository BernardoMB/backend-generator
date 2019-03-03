import { Router } from 'express';
//Controllers
import { CatController } from '../controllers/CatController';

//Validators
import { ObjectIdValidator } from './middlewares/validators/IdValidator';
/* import { ProductFieldsValidator, ProductFieldsPatchValidator } from './middlewares/validators/ProductValidator'; */
import { AuthenticationHeaderValidator } from './middlewares/validators/HeaderValidator';
import RequestValidator from './middlewares/validators/RequestValidator';

//Authentication
import { AuthenticateAdmin } from './middlewares/authenticators/AdminAuthenticator';
import { CatBusiness } from '../businesses/CatBusiness';
import { CatRepository } from '../repositories/CatRepository';

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
    router.put('', controller.update.bind(controller));
    router.delete('', controller.delete.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    return router;
  }
}
