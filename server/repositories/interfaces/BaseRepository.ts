
import { Document, Model } from 'mongoose';
import { IReadRepository } from '../interfaces/ReadRepository';
import { IWriteRepository } from '../interfaces/WriteRepository';

export abstract class RepositoryBase<T extends Document> implements IReadRepository<T>, IWriteRepository<T> {
  protected _model: Model<Document>;

  constructor(schemaModel: Model<Document>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<T> {
    return <T>await this._model.create(item);
  }

  async createMany(items: T[]): Promise<T[]> {
    return <T[]>await this._model.insertMany(items);
  }

  async retrieve(): Promise<T[]> {
    return <T[]>await this._model.find({}).exec();
  }

  async retrieveBy(conditions: any, projection?: any | null, options?: any | null): Promise<T[]> {
    return <T[]>await this._model.find(conditions, projection, options).exec();
  }

  async update(_id: string, item: T): Promise<T> {
    return <T>await this._model.findByIdAndUpdate(_id, item, { new: true }).exec();
  }

  async updateMany(conditions: any, item: T, options?: any | null): Promise<T[]> {
    return <T[]>await this._model.updateMany(conditions, item, options).exec();
  }

  async delete(_id: string): Promise<T> {
    return <T>await this._model.findByIdAndDelete(_id).exec();
  }

  async deleteMany(condition: any): Promise<any> {
    return await this._model.deleteMany(condition).exec();
  }

  async findById(_id: string): Promise<T> {
    return <T>await this._model.findById(_id).exec();
  }

  async find(conditions: any, projections?: string, options?: any): Promise<T[]> {
    if (!!projections && !options) {
      return <T[]>await this._model.find(conditions, projections).exec();
    }
    if (!!projections && !!options) {
      return <T[]>await this._model.find(conditions, projections, options).exec();
    }
    return <T[]>await this._model.find(conditions).exec();
  }

  async findOne(conditions: any, projections?: string, options?: any): Promise<T> {
    if (!!projections && !options) {
      return <T>await this._model.findOne(conditions, projections).exec();
    }
    if (!!projections && !!options) {
      return <T>await this._model.findOne(conditions, projections, options).exec();
    }
    return <T>await this._model.findOne(conditions).exec();
  }

  async drop() {
    return this._model.deleteMany({}).exec();
  }
}
