import { Router } from 'express';

const router = Router();

export class PlaygroundRoutes {

	controller;

	constructor() {
		this.controller = new Controller();
	}

	routes(): Router {
		const controller = this.controller;
		router.post('', controller.create.bind(controller));
		return router;
	}
}

class BaseController {
	business;
	constructor(business) {
		this.business = business;
	}
	async create(req, res) {
		await this.business.create().then((result) => {
			console.log(result);
			res.status(200).json({result});
		}, (err) => {
			console.log(err);
			res.status(500).json({err});
		});
	}
}

class Controller extends BaseController {
	constructor() {
		super(new Business);
	}
}

class BaseBusiness {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async create() {
		return await this.repository.create();
	}
}

class Business extends BaseBusiness {
	constructor() {
		super(new Repository());
	}
}

class RepositoryBase {
	constructor() { }
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
