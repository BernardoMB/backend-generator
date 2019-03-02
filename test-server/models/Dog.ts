import { Document } from 'mongoose';

import { IDog } from './interfaces/IDog';

export class Dog extends Document {

	private _dog: IDog;

	constructor(dog: IDog) {
		super();
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
        throw new Error('eat not implemented in class DogController');
        return null;
      }
        	public sleep(dream: string, time: Date): void {
        throw new Error('sleep not implemented in class DogController');
        return null;
      }
        }
