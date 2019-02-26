import { Interface, Property } from "./interfaces";

export const primitiveTypes = [
    'number',
    'string',
    'Date',
    'any',
    'boolean',
    'enum',
    'undefined',
    'Array',
    'never',
    
];

export const generateInterface = (_interface: Interface): Promise<any> => {
    return new Promise((resolve, reject) => {
        _interface.properties.forEach((property: Property) => {
            const propertyName = property.name;
            
        });
    });
}