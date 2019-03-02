
import { DogRepository } from '../repositories/DogRepository';
import { IDogBusiness } from './interfaces/IDogBusiness';
import { IDog } from '../models/interfaces/IDog';

export class DogBusiness implements IDogBusiness {
  
  private _dogRepository: DogRepository;
  
  constructor() {
    this._dogRepository = new DogRepository();
  }

  async create(item: IDog): Promise<IDog> {
    return await this._dogRepository.create(item);
  }
  
  async retrieve(): Promise<Array<IDog>> {
    const dogs: Array<IDog> = await this._dogRepository.retrieve();
    return dogs;
  }
  
  async update(_id: string, item: IDog): Promise<IDog> {
    const dog = await this._dogRepository.findById(_id);
    this.throwIfNotExists(dog);
    const updateddog: IDog = await this._dogRepository.update(dog._id, item);
    return updateddog;
  }

  async delete(_id: string): Promise<boolean> {
    this.throwIfNotExists(await this._dogRepository.delete(_id));
    return true;
  }
  
  async findById(_id: string): Promise<IDog> {
    const dog: IDog = await this._dogRepository.findById(_id);
    this.throwIfNotExists(dog);
    return dog;
  }
  
  public throwIfNotExists(item: IDog) {
    if (!item) {
      throw { message: 'Dog not found', code: 404 };
    }
  }

  
}
