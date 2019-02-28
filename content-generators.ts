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
} from "./interfaces";
import { toCamelCase } from "./utils";

export const generateInterfaceContent = async (_interface: Interface) => {
  let content: string = "";
  if (_interface.externalRefs.length > 0) {
    for (let externalRef of _interface.externalRefs) {
      content += `import { I${externalRef} } from './I${externalRef}';\n`;
    }
    content += "\n";
  }
  content += `export interface I${_interface.name} {\n`;
  _interface.properties.forEach((property: Property) => {
    content += `\t${property.name}${property.required ? "" : "?"}: ${
      property.type
      };\n`;
  });
  content += "}\n";
  return content;
};

export const generateClassContent = async (_class: Class) => {
  let content: string = `import { Document } from 'mongoose';\n\n`;
  const camelCaseName = toCamelCase(_class.name);
  if (_class.externalRefs.length > 0) {
    for (let extRef of _class.externalRefs) {
      content += `import { I${extRef} } from './interfaces/I${extRef}';\n`;
    }
    content += "\n";
  }
  content += `import { I${_class.name} } from './interfaces/I${
    _class.name
    }';\n\n`;
  content += `export class ${
    _class.name
    } extends Document {\n\n\tprivate _${camelCaseName}: I${_class.name};\n\n`;
  content += `\tconstructor(${camelCaseName}: I${
    _class.name
    }) {\n\t\tsuper();\n\t\tthis._${camelCaseName} = ${camelCaseName};\n\t}\n\n`;
  _class.properties.forEach((property: Property) => {
    content += `\tget ${property.name}(): ${
      property.type
      } {\n\t\treturn this._${camelCaseName}.${property.name};\n\t}\n\n`;
  });
  _class.methods.forEach((method: Method) => {
    content += `\t${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? "" : " "}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? "" : ","
        }`;
    });
    content += `): ${method.type} {\n\t\treturn new Error('${
      method.name
      } not implemented in class ${_class.name}');\n\t}\n\n`;
  });
  content += "}\n";
  return content;
};

export const generateHandleErrorContent = async () => `
import { NextFunction } from 'express';

export function handleError(error, message: string, next: NextFunction) {
  next({
    message: \`\${message}: \${error.message}\`,
    code: !!error.code ? error.code : 500
  });
}
`;

export const generateBaseControllerContent = async () => `
import { IBaseBusiness } from './../../../business/interfaces/base/BaseBusiness';
import { IWriteController } from '../common/WriteController';
import { IReadController } from '../common/ReadController';
  
export interface IBaseController<T extends IBaseBusiness<Object>> extends IReadController, IWriteController {}
`;

export const generateReadControllerContent = async () => `
import { RequestHandler } from 'express';

export interface IReadController {
    retrieve: RequestHandler;
    findById: RequestHandler;
}
`;

export const generateWriteControllerContent = async () => `
import { RequestHandler } from 'express';

export interface IWriteController {
    create: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
}
`;

export const generateControllerContent = async (controller: Controller) => {
  const name: string = controller.name;
  let content: string = `
import { Request, Response, NextFunction } from 'express';
import { handleError } from './helps/handle-error';
import { IBaseController } from './interfaces/base/BaseController';
import { ${name}Business } from '../businesses/${name}Business';
import { I${name} } from './../models/interfaces/I${name}';`;
  controller.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../model/interfaces/I${externalRef}';
    `;
  });
  content += `
export class ${name}Controller implements IBaseController<${name}Business> {
  `;
  controller.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const ${toCamelCase(name)}: I${name} = <I${name}>request.body;
      const ${toCamelCase(name)}Business = new ${name}Business();
      const created${name}: I${name} = await ${toCamelCase(name)}Business.create(${toCamelCase(name)});
      response.status(200).json({ ${toCamelCase(name)}: created${name} });
    } catch (error) {
      handleError(error, 'Error creating ${toCamelCase(name)}', next);
    }
  }

  public async retrieve(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const ${toCamelCase(name)}Business = new ${name}Business();
      const ${toCamelCase(name)}s: Array<I${name}> = await ${toCamelCase(name)}Business.retrieve();
      response.status(200).json({ ${toCamelCase(name)}s: ${toCamelCase(name)}s });
    } catch (error) {
      handleError(error, 'Error retrieving ${toCamelCase(name)}s', next);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction) {
    try {
      const new${name}: I${name} = <I${name}>request.body;
      const {
        params: { id }
      } = request;
      const ${toCamelCase(name)}Business = new ${name}Business();
      const updated${name}: I${name} = await ${toCamelCase(name)}Business.update(id, new${name});
      response.status(201).json({ ${toCamelCase(name)}: updated${name} });
    } catch (error) {
      handleError(error, ' Error updating ${toCamelCase(name)}', next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const ${toCamelCase(name)}Business = new ${name}Business();
      await ${toCamelCase(name)}Business.delete(id);
      response.status(200).json({ id });
    } catch (error) {
      handleError(error, ' Error deleting ${toCamelCase(name)}', next);
    }
  }

  public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const ${toCamelCase(name)}Business = new ${name}Business();
      const ${toCamelCase(name)}: I${name} = await ${toCamelCase(name)}Business.findById(id);
      response.status(200).json({ ${toCamelCase(name)}: ${toCamelCase(name)} });
    } catch (error) {
      handleError(error, 'Error finding ${toCamelCase(name)}', next);
    }
  }\n
  `;
  
  controller.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? "" : " "}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? "" : ","
        }`;
    });
    content += `): ${method.type} {
    throw new Error('${method.name} not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
};

export const generateBaseBusinessContent = async () => `
import { IRead } from '../common/Read';
import { IWrite } from '../common/Write';

export interface IBaseBusiness<T> extends IRead<T>, IWrite<T> {
  throwIfNotExists?: (item: T) => void;
}
`;

export const generateReadBusinessContent = async () => `
export interface IRead<T> {
  retrieve: () => Promise<T[]>;
  findById: (id: string) => Promise<T>;
}
`;

export const generateWriteBusinessContent = async () => `
export interface IWrite<T> {
  create: (item: T, callback: (error: any, result: T ) => void) => void;
  update: (_id: string, item: T, callback: (error: any, result: T) => void) => void ;
  delete: (_id: string, callback: (error: any, result: string) => void) => void;
}
`;

export const generateBusinessInterfaceContent = async (business: Business) => {
  const name: string = business.name;
  let content:  string = `
import { IBaseBusiness } from './base/BaseBusiness';
import { I${name} } from './../../models/interfaces/I${name}';

export interface I${name}Business extends IBaseBusiness<I${name}> {}
  `;
  return content;
}

export const generateBusinessContent = async (business: Business) => {
  const name: string = business.name;
  let content: string = `
import { ${name}Repository } from '../repository/${name}Repository';
import { I${name}Business } from './interfaces/I${name}Business';
import { I${name} } from '../models/interfaces/I${name}';`;
  business.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../model/interfaces/I${externalRef}';
    `;
  });
  content += `
export class ${name}Business implements I${name}Business {
  `;
  business.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  private _${toCamelCase(name)}Repository: ${name}Repository;
  
  constructor() {
    this._${toCamelCase(name)}Repository = new ${name}Repository();
  }

  async create(item: I${name}): Promise<I${name}> {
    return await this._${toCamelCase(name)}Repository.create(item);
  }
  
  async retrieve(): Promise<Array<I${name}>> {
    const ${toCamelCase(name)}s: Array<I${name}> = await this._${toCamelCase(name)}Repository.retrieve();
    return ${toCamelCase(name)}s;
  }
  
  async update(_id: string, item: I${name}): Promise<I${name}> {
    const ${toCamelCase(name)} = await this._${toCamelCase(name)}Repository.findById(_id);
    this.throwIfNotExists(${toCamelCase(name)});
    const updated${toCamelCase(name)}: I${name} = await this._${toCamelCase(name)}Repository.update(${toCamelCase(name)}._id, item);
    return updated${toCamelCase(name)};
  }

  async delete(_id: string): Promise<boolean> {
    this.throwIfNotExists(await this._${toCamelCase(name)}Repository.delete(_id));
    return true;
  }
  
  async findById(_id: string): Promise<I${name}> {
    const ${toCamelCase(name)}: I${name} = await this._${toCamelCase(name)}Repository.findById(_id);
    this.throwIfNotExists(${toCamelCase(name)});
    return ${toCamelCase(name)};
  }
  
  throwIfNotExists(item: I${name}) {
    if (!item) {
      throw { message: '${name} not found', code: 404 };
    }
  }
  `;
  
  business.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? "" : " "}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? "" : ","
        }`;
    });
    content += `): ${method.type} {
    throw new Error('${method.name} not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
}

export const generateBaseRepositoryContent = async () => `
import { Document, Model } from 'mongoose';
import { IWrite } from '../interfaces/base/Write';
import { IRead } from '../interfaces/base/Read';

export abstract class RepositoryBase<T extends Document> implements IRead<T>, IWrite<T> {
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
`;

export const generateReadRepositoryContent = async () => `
export interface IRead<T> {
  retrieve: () => Promise<T[]>;
  retrieveBy: (conditions: any, projection?: any | null, options?: any | null) => Promise<T[]>;
  find: (conditions: any, projections?: string, options?: any) => Promise<T[]>;
  findOne: (conditions: any, projections?: string, options?: any) => Promise<T>;
  findById: (id: string) => Promise<T>;
}
`;
export const generateWriteRepositoryContent = async () => `
export interface IWrite<T> {
  create: (item: T) => Promise<T>;
  createMany: (items: T[]) => Promise<T[]>;
  update: (_id: string, item: T) => Promise<T>;
  updateMany: (conditions: any, item: T, options?: any | null) => Promise<T[]>;
  delete: (_id: string) => Promise<T>;
  deleteMany: (condition: any) => Promise<any>;
  drop: () => Promise<any>;
}
`;

export const generateRepositoryContent = async (repository: Repository) => {
  const name: string = repository.name;
  let content: string = `
import { RepositoryBase } from './base/RepositoryBase';
import { I${name} } from '../models/interfaces/I${name}';
import { ${name}Schema } from '..data-access/schemas/${name}Schema';`;
  repository.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../model/interfaces/I${externalRef}';
    `;
  });
  content += `
\nexport class ${name}Repository extends RepositoryBase<I${name}> {
  `;
  repository.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  constructor() {
    super(${name}Schema);
  }
  `;
  
  repository.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? "" : " "}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? "" : ","
        }`;
    });
    content += `): ${method.type} {
    throw new Error('${method.name} not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
}
