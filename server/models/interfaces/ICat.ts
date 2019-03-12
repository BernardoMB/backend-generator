import * as mongoose from 'mongoose';
import { IPerson } from './IPerson';
import { IDog } from './IDog';

export interface ICat extends mongoose.Document {
	name: string;
	height?: number;
	weight?: number;
	age?: number;
	owners?: Array<IPerson>;
	someProperty?: { key1: IPerson, key2: number, key3: Array<IDog> };
}
