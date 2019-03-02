
import { PersonRepository } from '../repositories/PersonRepository';
import { IPersonBusiness } from './interfaces/IPersonBusiness';
import { IPerson } from '../models/interfaces/IPerson';

export class PersonBusiness implements IPersonBusiness {
  
  private _personRepository: PersonRepository;
  
  constructor() {
    this._personRepository = new PersonRepository();
  }

  async create(item: IPerson): Promise<IPerson> {
    return await this._personRepository.create(item);
  }
  
  async retrieve(): Promise<Array<IPerson>> {
    const persons: Array<IPerson> = await this._personRepository.retrieve();
    return persons;
  }
  
  async update(_id: string, item: IPerson): Promise<IPerson> {
    const person = await this._personRepository.findById(_id);
    this.throwIfNotExists(person);
    const updatedperson: IPerson = await this._personRepository.update(person._id, item);
    return updatedperson;
  }

  async delete(_id: string): Promise<boolean> {
    this.throwIfNotExists(await this._personRepository.delete(_id));
    return true;
  }
  
  async findById(_id: string): Promise<IPerson> {
    const person: IPerson = await this._personRepository.findById(_id);
    this.throwIfNotExists(person);
    return person;
  }
  
  public throwIfNotExists(item: IPerson) {
    if (!item) {
      throw { message: 'Person not found', code: 404 };
    }
  }

  
}
