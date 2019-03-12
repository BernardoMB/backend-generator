
import { IReadBusiness } from "../interfaces/ReadBusiness";
import { IWriteBusiness } from "../interfaces/WriteBusiness";

export class BaseBusiness<T> implements IReadBusiness<T>, IWriteBusiness<T> {
  
  public _repository;
  
  constructor(repository) {
    this._repository = repository;
  }
  
  async create(item: T): Promise<T> {
    const createdItem: T = await this._repository.create(item);
    return createdItem;
  }
  
  async read(): Promise<Array<T>> {
    const items: Array<T> = await this._repository.read();
    return items;
  }
  
  async update(_id: string, item: T): Promise<T> {
    const itemToBeUpdated: T = await this._repository.findById(_id);
    this.throwIfNotExists(itemToBeUpdated);
    const updatedItem: T = await this._repository.update((<any>itemToBeUpdated)._id, item);
    return updatedItem;
  }

  async delete(_id: string): Promise<boolean> {
    this.throwIfNotExists(await this._repository.delete(_id));
    return true;
  }
  
  async findById(_id: string): Promise<T> {
    const item: T = await this._repository.findById(_id);
    this.throwIfNotExists(item);
    return item;
  }
  
  public throwIfNotExists(item: T) {
    if (!item) {
      throw { message: 'Item not found', code: 404 };
    }
  }
  
}
