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

const router = Router();

export class CatRoutes {
	private catRepository: CatRepository;
	private catBussines: CatBusiness;
  private _catController: CatController;

  constructor() {
		this.catRepository = new CatRepository();
		this.catBussines = new CatBusiness(this.catRepository);
    this._catController = new CatController(this.catBussines);
  }

  routes(): Router {
    const controller = this._catController;
    router.post('', controller.create);
    return router;
  }
}
