export interface Property {
    name: string,
    type: string,
    required: boolean,
    schema?: any
}

export interface ClassProperty {
    accesor: string,
    name: string,
    type: string
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

export interface Class {
    name: string,
    properties: Array<Property>,
    methods: Array<Method>,
    externalRefs: Array<string>
}

export interface Controller {
    name: string,
    properties: Array<ClassProperty>,
    methods: Array<Method>,
    externalRefs: Array<string>
}

export interface Business {
    name: string,
    properties: Array<ClassProperty>,
    methods: Array<Method>,
    externalRefs: Array<string>
}

export interface Repository {
    name: string,
    properties: Array<ClassProperty>,
    methods: Array<Method>,
    externalRefs: Array<string>
}

export interface Model {
    name: string,
    interface: boolean,
    class: boolean,
    flat: boolean,
    properties: Array<Property>,
    methods: Array<Method>,
    externalRefs: Array<string>,
    controller: {
        include: boolean,
        properties: Array<ClassProperty>,
        methods: Array<Method>,
        externalRefs: Array<string>
    },
    business: {
        include: boolean,
        properties: Array<ClassProperty>,
        methods: Array<Method>,
        externalRefs: Array<string>
    },
    repository: {
        include: boolean,
        properties: Array<ClassProperty>,
        methods: Array<Method>,
        externalRefs: Array<string>
    }
}
