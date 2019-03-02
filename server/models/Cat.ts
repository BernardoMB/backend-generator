import { Document } from 'mongoose';

import { IPerson } from './interfaces/IPerson';

import { ICat } from './interfaces/ICat';

export class Cat extends Document {

	private _cat: ICat;

	constructor(cat: ICat) {
		super();
		this._cat = cat;
	}

	get name(): string {
		return this._cat.name;
	}

	get height(): number {
		return this._cat.height;
	}

	get weight(): number {
		return this._cat.weight;
	}

	get age(): number {
		return this._cat.age;
	}

	get owners(): Array<IPerson> {
		return this._cat.owners;
	}

	private eat(food: Array<string>, time: Date): boolean {
        throw new Error('eat not implemented in class CatController');
        return null;
      }
        	public sleep(dream: string): void {
        throw new Error('sleep not implemented in class CatController');
        return null;
      }
        }
