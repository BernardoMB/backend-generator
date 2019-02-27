import { Model, Interface, Property, Class } from "./interfaces";
import chalk from "chalk";
import { writeInterface, writeClass } from "./writers";

export const generateModel = async (model: Model) => {
        const files: Array<string> = [];
        let filePath: string;
        const _interface: Interface = {
            name: model.name,
            properties: model.properties,
            externalRefs: model.externalRefs
        }
        filePath = await writeInterface(_interface, model.flat);
        files.push(filePath);
        const _class: Class = {
            name: model.name,
            properties: model.properties,
            methods: model.methods,
            externalRefs: model.externalRefs
        }
        filePath = await writeClass(_class, model.flat);
        files.push(filePath);
        return files;
}