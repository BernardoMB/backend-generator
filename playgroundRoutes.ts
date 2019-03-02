import { Router } from 'express';

const router = Router();

export class PlaygroundRoutes {

	controller;

  constructor() {
		this.controller = new Controller();	
	}

  routes(): Router {
    router.post('', this.controller.create);
    return router;
  }
}

class BaseController {
	business;
	constructor(business) {
		this.business = business;
	}
	create(req, res) {
		this.business.create().then((res) => {
			console.log(res);
			//const message = 'Hola';
			res.status(200).json({res});
		}, (err) => {
			console.log(err);
			res.status(500);
		});
	}
}

class Controller extends BaseController {
	constructor() {
		super(new Business());
	}
}

class BaseBsusiness {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async create() {
		return await this.repository.create();
	}
}

class Business extends BaseBsusiness {
	constructor() {
		super(new Repository());
	}
}

class RepositoryBase {
	constructor() {}
	async create() {
		return 'creating';
	}
}

class Repository extends RepositoryBase {
	constructor() {
		super();
	}
}

/* const myController = new Controller();
myController.create().then((res) => {
	console.log(res);
}, (err) => {
	console.log(err);
}); */
