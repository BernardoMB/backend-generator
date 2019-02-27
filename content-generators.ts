import {
  Interface,
  Property,
  Class,
  Method,
  Argument,
  Controller,
  ClassProperty
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

export const generateControllerContent = async (controller: Controller) => {
  const name: string = controller.name;
  let content: string = `
        import { Request, Response, NextFunction } from 'express';
        import { handleError } from './helps/handle-error';
        import { IBaseController } from './interfaces/base/BaseController';
        import { ${name}Business } from '../businesses/${name}Business';
        import { I${name} } from './../model/interfaces/I${name}';
    `;
  controller.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../model/interfaces/I${externalRef}';\n`;
  });
  content += `
        export class ${name}Controller implements IBaseController<${name}Business> {\n
        
            public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
                try {
                    const ${toCamelCase(name)}: I${name} = <I${name}>request.body;
                    const ${toCamelCase(name)}Business = new ${name}Business();
                    const created${name}: I${name} = await ${toCamelCase(name)}Business.create(${toCamelCase(name)});
                    response.status(200).json({ ${toCamelCase(name)}: created${name} });
                } catch (error) {
                    handleError(error, 'Error creating ${toCamelCase(
                      name
                    )}', next);
                }
            }

            public async retrieve(request: Request, response: Response, next: NextFunction): Promise<void> {
                try {
                  const ${toCamelCase(name)}Business = new ${name}Business();
                  const ${toCamelCase}: Array<I${name}> = await ${toCamelCase(name)}Business.retrieve();
                  response.status(200).json({ products });
                } catch (error) {
                  handleError(error, 'Error retrieving products', next);
                }
              }

              public async update(req: Request, res: Response, next: NextFunction) {
                try {
                  const update: IProduct = <IProduct>req.body;
                  const {
                    params: { id }
                  } = req;
                  const productBusiness = new ProductBusiness();
                  const product = await productBusiness.update(id, update);
                  res.status(201).json({ product });
                } catch (error) {
                  handleError(error, ' Error updating product', next);
                }
              }

              public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
                try {
                  const {
                    params: { id }
                  } = req;
                  const productBusiness = new ProductBusiness();
                  await productBusiness.delete(id);
                  res.json({ id });
                } catch (error) {
                  handleError(error, ' Error deleting product', next);
                }
              }

              public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
                try {
                  const {
                    params: { id }
                  } = req;
                  const productBusiness = new ProductBusiness();
                  const product = await productBusiness.findById(id);
                  res.json({ product });
                } catch (error) {
                  handleError(error, 'Error finding product', next);
                }
              }
            
              
    `;
  controller.properties.forEach((property: ClassProperty) => {
    content += `\t${property.accesor} ${property.name}: ${property.type};\n`;
  });
  content += "\n";
  controller.methods.forEach((method: Method) => {
    content += `\t${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? "" : " "}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? "" : ","
      }`;
    });
    content += `): ${method.type} {\n\t\treturn new Error('${
      method.name
    } not implemented in class ${name}Controller');\n\t}\n\n`;
  });
  content += "}\n";
  return content;
};
