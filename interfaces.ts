export interface Property {
    name: string,
    type: string,
    required: boolean 
}

export interface Argument {
    name: string,
    type: string
}

export interface Method {
    name: string,
    accesor: string,
    type: string,
    arguments: Array<Argument>
}

export interface Interface {
    name: string,
    properties: Array<Property>,
    externalRefs: Array<string>
}

export interface _class {
    name: string,
    properties: Array<Property>,
    methods: Array<Method>,
    externalRefs: Array<string>
}

export interface Model {
    name: string,
    controller: boolean,
    business: boolean,
    respository: boolean,
    class: boolean,
    flat: boolean,
    properties: Array<Property>,
    methods: Array<Method> 
}
