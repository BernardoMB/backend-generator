import { Model, Interface, Class } from "./interfaces";
import { writeInterface, writeClass } from "./writers";

export const generateModel = async (model: Model) => {
        const files: Array<string> = [];
        let filePath: string;
        if (model.interface) {
            const _interface: Interface = {
                name: model.name,
                properties: model.properties,
                externalRefs: model.externalRefs
            }
            filePath = await writeInterface(_interface, model.flat);
            files.push(filePath);
        }
        if (model.class) {
            const _class: Class = {
                name: model.name,
                properties: model.properties,
                methods: model.methods,
                externalRefs: model.externalRefs
            }
            filePath = await writeClass(_class, model.flat);
            files.push(filePath);
        }
        return files;
}