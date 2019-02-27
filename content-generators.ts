import { Interface, Property, Class, Method, Argument } from "./interfaces";
import { toCamelCase } from "./utils";

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
        content += `\t${property.name}${property.required ? '' : '?'}: ${property.type};\n`;
    });
    content += '}\n';
    return content;
}

export const generateClassContent = async (_class: Class) => {
    let content: string = `import { Document } from 'mongoose';\n\n`;
    const camelCaseName = toCamelCase(_class.name);
    if (_class.externalRefs.length > 0) {
        for (let extRef of _class.externalRefs) {
            content += `import { I${extRef} } from './interfaces/I${extRef}';\n`;
        }
        content += '\n';
    }
    content += `import { I${_class.name} } from './interfaces/I${_class.name}';\n\n`;
    content += `export class ${_class.name} extends Document {\n\n\tprivate _${camelCaseName}: I${_class.name};\n\n`;
    content += `\tconstructor(${camelCaseName}: I${_class.name}) {\n\t\tthis._${camelCaseName} = ${camelCaseName};\n\t}\n\n`;
    _class.properties.forEach((property: Property) => {
        content += `\tget ${property.name}(): ${property.type} {\n\t\treturn this._${camelCaseName}.${property.name};\n\t}\n\n`;
    });
    _class.methods.forEach((method: Method) => {
        content += `\t${method.accesor} ${method.name}(`;
        method.arguments.forEach((argument: Argument, index: number) => {
            content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${(index === (method.arguments.length - 1)) ? '' : ','}`;
        });
        content += `): ${method.type} {\n\t\treturn new Error('${method.name} not implemented in class ${_class.name}');\n\t}\n\n`;
    });
    content += '}\n';
    return content;
}