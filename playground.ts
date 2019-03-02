class BaseController {
	business;
	constructor(business) {
		this.business = business;
	}
	async create() {
		return await this.business.create();
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






const myController = new Controller();
myController.create().then((res) => {
	console.log(res);
}, (err) => {
	console.log(err);
});