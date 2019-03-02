import { BaseRepository } from './../../repositories/base/BaseRepository';

export class BaseBusiness {
	
	repository;
	
	constructor(repository) {
		this.repository = repository;
	}

	async create() {
		this.repository.create();
		return '';
	}


	// TODO: specify type of item and change return type.
	/* async create(item): Promise<any> {
    return await this._repository.create(item);
  } */
	
	// TODO: Change return type.
  /* async retrieve(): Promise<Array<any>> {
    const cats: Array<any> = await this._repository.retrieve();
    return cats;
  } */
	
	// TODO: Use types
  /* async update(_id: string, item): Promise<any> {
    const itemToBeUpdated = await this._repository.findById(_id);
    this.throwIfNotExists(itemToBeUpdated);
    const updatedItem = await this._repository.update(itemToBeUpdated._id, item);
    return updatedItem;
  } */

	// TODO: Use appropiate types.
  /* async delete(_id: string): Promise<boolean> {
    this.throwIfNotExists(await this._repository.delete(_id));
    return true;
  } */
	
	// Use types.
  /* async findById(_id: string): Promise<any> {
    const item = await this._repository.findById(_id);
    this.throwIfNotExists(item);
    return item;
  } */
	
	// Use appropiate types.
  /* public throwIfNotExists(item: any) {
    if (!item) {
      throw { message: 'Item not found', code: 404 };
    }
	} */
	
}