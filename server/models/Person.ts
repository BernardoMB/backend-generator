import { IPerson } from './interfaces/IPerson';

export class Person extends Document {

	private _person: IPerson;

	constructor(person: IPerson) {
		super();
		this._person = person;
	}

	get name(): string {
		return this._person.name;
	}

	get height(): number {
		return this._person.height;
	}

	get weight(): number {
		return this._person.weight;
	}

	get age(): number {
		return this._person.age;
	}


}