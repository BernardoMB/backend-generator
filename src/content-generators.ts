import {
  Interface,
  Property,
  Class,
  Method,
  Argument,
  Controller,
  ClassProperty,
  Business,
  Repository
} from './interfaces';
import { toCamelCase } from './utils';

export const generateInterfaceContent = async (_interface: Interface) => {
  let content: string = '';
  if (_interface.externalRefs.length > 0) {
    for (let externalRef of _interface.externalRefs) {
      content += `import { I${externalRef} } from './I${externalRef}';\n`;
    }
    content += '\n';
  }
  content += `export interface I${_interface.name} {\n`;
  _interface.properties.forEach((property: Property) => {
    content += `\t${property.name}${property.required ? '' : '?'}: ${
      property.type
    };\n`;
  });
  content += '}\n';
  return content;
};

export const generateClassContent = async (_class: Class) => {
  let content: string = `import { Document } from 'mongoose';\n\n`;
  const name = _class.name;
  const camelCaseName = toCamelCase(name);
  if (_class.externalRefs.length > 0) {
    for (let extRef of _class.externalRefs) {
      content += `import { I${extRef} } from './interfaces/I${extRef}';\n`;
    }
    content += '\n';
  }
  content += `import { I${name} } from './interfaces/I${name}';\n\n`;
  content += `export class ${name} extends Document {\n\n\tprivate _${camelCaseName}: I${name};\n\n`;
  content += `\tconstructor(${camelCaseName}: I${name}) {\n\t\tsuper();\n\t\tthis._${camelCaseName} = ${camelCaseName};\n\t}\n\n`;
  _class.properties.forEach((property: Property) => {
    content += `\tget ${property.name}(): ${
      property.type
    } {\n\t\treturn this._${camelCaseName}.${property.name};\n\t}\n\n`;
  });
  _class.methods.forEach((method: Method) => {
    content += `\t${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
      }`;
    });
    content += `): ${method.type} {
        throw new Error('${method.name} not implemented in class ${
      name
    }Controller');
        return null;
      }
        `;
  });
  content += '}\n';
  return content;
};

export const generateHandleErrorContent = async () => {
  return `
import { NextFunction } from 'express';

export function handleError(error, message: string, next: NextFunction) {
  next({
    message: \`\${message}: \${error.message}\`,
    code: !!error.code ? error.code : 500
  });
}
  `;
}

export const generateBaseControllerContent = async () => {
  return `
import { Request, Response, NextFunction } from 'express';
import { handleError } from './../helps/handle-error';
import { IReadController } from '../interfaces/IReadController';
import { IWriteController } from '../interfaces/IWriteController';

export class BaseController<T> implements IReadController<T>, IWriteController<T> {
  
  public _business;
  
  constructor(business) {
    this._business = business;
  }

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const item: T = <T>request.body;
      const createdItem: T = await this._business.create(item);
      response.status(201).json({ item: createdItem });
    } catch (error) {
      handleError(error, 'Error creating item', next);
    }
  }
  
  public async read(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const items: Array<T> = await this._business.read();
      response.status(200).json({ items });
    } catch (error) {
      handleError(error, 'Error retrieving cats', next);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const newItem: T = <T>request.body;
      const {
        params: { id }
      } = request;
      const updatedItem: T = await this._business.update(id, newItem);
      response.status(202).json({ item: updatedItem });
    } catch (error) {
      handleError(error, ' Error updating cat', next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      await this._business.delete(id);
      response.status(200).json({ id });
    } catch (error) {
      handleError(error, ' Error deleting cat', next);
    }
  }

  public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const item: T = await this._business.findById(id);
      response.status(200).json({ item });
    } catch (error) {
      handleError(error, 'Error finding cat', next);
    }
  }

}
  `;
}

export const generateIReadControllerContent = async () => {
  return `
import { RequestHandler } from 'express';

export interface IReadController<T> {
    read: RequestHandler,
    findById: RequestHandler
}
  `;
}

export const generateIWriteControllerContent = async () => {
  return `
import { RequestHandler } from 'express';

export interface IWriteController<T> {
    create: RequestHandler,
    update: RequestHandler,
    delete: RequestHandler
}
  `;
}

export const generateControllerContent = async (controller: Controller) => {
  const name: string = controller.name;
  let content: string = `
import { BaseController } from './base/BaseController';
import { ${name}Business } from '../businesses/${name}Business';
import { I${name} } from '../models/interfaces/I${name}';\n`;
  controller.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../models/interfaces/I${externalRef}';
    `;
  });
  content += `
export class ${name}Controller extends BaseController<I${name}> {
  `;
  controller.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  constructor() {
    super(new ${name}());
  }
  \n
  `;
  controller.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
      }`;
    });
    content += `): ${method.type} {
    throw new Error('${
      method.name
    } not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
};

export const generateBaseBusinessContent = async () => {
  return `
import { IReadBusiness } from "../interfaces/IReadBusiness";
import { IWriteBusiness } from "../interfaces/IWriteBusiness";

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
  `;
}

export const generateIReadBusinessContent = async () => {
  return `
export interface IReadBusiness<T> {
  create(item: T): Promise<T>,
  update(_id: string, item: T): Promise<T>,
  delete(_id: string): Promise<boolean>
}  
  `;
}

export const generateIWriteBusinessContent = async () => {
  return `
export interface IWriteBusiness<T> {
  read(): Promise<Array<T>>,
  findById(_id: string): Promise<T>
}
  `;
}

export const generateBusinessContent = async (business: Business) => {
  const name: string = business.name;
  let content: string = `
import { ${name}Repository } from '../repositories/${name}Repository';
import { I${name} } from '../models/interfaces/I${name}';
import { BaseBusiness } from './base/BaseBusiness';\n`;
  business.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../models/interfaces/I${externalRef}';
    `;
  });
  content += `
export class ${name}Business extends BaseBusiness<I${name}> {
  `;
  business.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  constructor() {
    super(new ${name}Repository());
  }\n
  `;
  business.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
      }`;
    });
    content += `): ${method.type} {
    throw new Error('${
      method.name
    } not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
};

export const generateBaseRepositoryContent = async () => {
  return `
import { Document, Model } from 'mongoose';
import { IReadRepository } from '../interfaces/IReadRepository';
import { IWriteRepository } from '../interfaces/IWriteRepository';

export class BaseRepository<T extends Document> implements IReadRepository<T>, IWriteRepository<T> {

  public _model: Model<Document>;

  constructor(schemaModel: Model<Document>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<T> {
    return <T>await this._model.create(item);
  }

  async createMany(items: T[]): Promise<T[]> {
    return <T[]>await this._model.insertMany(items);
  }

  async read(): Promise<T[]> {
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
  `;
}

export const generateIReadRepositoryContent = async () => {
  return `
export interface IReadRepository<T> {
  read(): Promise<T[]>,
  retrieveBy(conditions: any, projection?: any | null, options?: any | null): Promise<T[]>,
  findById(_id: string): Promise<T>,
  find(conditions: any, projections?: string, options?: any): Promise<T[]>,
  findOne(conditions: any, projections?: string, options?: any): Promise<T>
}
  `;
}

export const generateIWriteRepositoryContent = async () => {
  return `
export interface IWriteRepository<T> {
  create(item: T): Promise<T>,
  createMany(items: T[]): Promise<T[]>,
  update(_id: string, item: T): Promise<T>,
  updateMany(conditions: any, item: T, options?: any | null): Promise<T[]>,
  delete(_id: string): Promise<T>,
  deleteMany(condition: any): Promise<any>,
  drop(): Promise<any>
}
  `;
}

export const generateRepositoryContent = async (repository: Repository) => {
  const name: string = repository.name;
  let content: string = `
import { BaseRepository } from './base/BaseRepository';
import { ${toCamelCase(name)}Schema } from '..data-access/schemas/${name}Schema';
import { I${name} } from '../models/interfaces/I${name}';`;
  repository.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../models/interfaces/I${externalRef}';
    `;
  });
  content += `
\nexport class ${name}Repository extends BaseRepository<I${name}> {
  `;
  repository.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  constructor() {
    super(${toCamelCase(name)}Schema);
  }
  `;
  repository.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
      }`;
    });
    content += `): ${method.type} {
    throw new Error('${
      method.name
    } not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
};
