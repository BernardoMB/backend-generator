import { Router, Request, Response, NextFunction, RequestHandler } from 'express';

const router = Router();

interface IDummy {
	name: string;
}

export class PlaygroundRoutes {

	public controller: Controller<IDummy>;

	constructor() {
		this.controller = new Controller();
	}

	routes(): Router {
		const controller = this.controller;
		router.post('', controller.create.bind(controller));
		return router;
	}
}

interface IReadController<T> {
	retieve: RequestHandler
}

interface IWriteController<T> {
	create: RequestHandler
}

class BaseController<T> implements IReadController<T>, IWriteController<T> {
	public business: Business<T>;
	constructor(business: Business<T>) {
		this.business = business;
	}
	async create(request: Request, response: Response, next: NextFunction): Promise<void> {
		await this.business.create().then((result: string) => {
			console.log(result);
			response.status(200).json({result});
		}, (error) => {
			console.log(error);
			response.status(500).json({error});
		});
	}
	async retieve(request: Request, response: Response, next: NextFunction): Promise<void> {
		console.log('Esta funcion no hace nada');
	}
}

class Controller<T> extends BaseController<T> {
	constructor() {
		super(new Business<T>());
	}
}

class BaseBusiness<T> {
	public repository: Repository<T>;
	constructor(repository: Repository<T>) {
		this.repository = repository;
	}
	async create(): Promise<string> {
		return await this.repository.create();
	}
}

class Business<T> extends BaseBusiness<T> {
	constructor() {
		super(new Repository<T>());
	}
}

class RepositoryBase<T> {
	constructor() { }
	async create(): Promise<string> {
		return 'creating';
	}
}

class Repository<T> extends RepositoryBase<T> {
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
