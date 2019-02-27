import { Document } from 'mongoose';

import { IDog } from './interfaces/IDog';

export class Dog extends Document {

	private _dog: IDog;

	constructor(dog: IDog) {
		this._dog = dog;
	}

	get name(): string {
		return this._dog.name;
	}

	get height(): number {
		return this._dog.height;
	}

	get weight(): number {
		return this._dog.weight;
	}

	get age(): number {
		return this._dog.age;
	}

	private eat(food: Array<string>, time: Date): boolean {
		return new Error('eat not implemented in class Dog');
	}

	public sleep(dream: string, time: Date): void {
		return new Error('sleep not implemented in class Dog');
	}

}
