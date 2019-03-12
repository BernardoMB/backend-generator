import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from './middlewares/authenticate';

const router: Router = Router();

export class UserRoutes {

  public userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  routes(): Router {
    const controller = this.userController;
    // Custom user routes
    router.post('', controller.create.bind(controller));
    router.get('/me', authenticate, controller.me.bind(controller));
    router.post('/login', controller.login.bind(controller));
    router.delete('/logout', authenticate, controller.logout.bind(controller));
    // Generic routes
    router.get('', controller.read.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    return router;
  }
}  
