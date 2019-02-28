import { IPerson } from './IPerson';

export interface ICat {
	name: string;
	height?: number;
	weight?: number;
	age?: number;
	owners?: Array<IPerson>;
}
