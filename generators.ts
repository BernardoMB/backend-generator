import { Model, Interface, Class, Controller, Business, Repository } from "./interfaces";
import { writeInterface, writeClass, writeController, writeBusiness, writeRepository, writeControllerFiles, writeBusinessFiles, writeRepositoryFiles } from "./writers";
import chalk from "chalk";

export const generateGenericServerFiles = async () => {
    let files: Array<string> = [];
    files = [
        ...files,
        ...(await writeControllerFiles())
    ];
    /* filePaths = await writeControllerFiles();
    filePaths.forEach((filePath: string) => {
        files.push(filePath);
    }); */
    files = [
        ...files,
        ...(await writeBusinessFiles())
    ]
    /* filePaths = await writeBusinessFiles(); 
    filePaths.forEach((filePath: string) => {
        files.push(filePath);
    }); */
    files = [
        ...files,
        ...(await writeRepositoryFiles())
    ]
    /* filePaths = await writeRepositoryFiles(); 
    filePaths.forEach((filePath: string) => {
        files.push(filePath);
    }); */
    return files;
}

export const generateModel = async (model: Model) => {
    let files: Array<string> = [];
    let filePath: string;
    let filePaths: Array<string>;
    if (model.interface) {
        const _interface: Interface = {
            name: model.name,
            properties: model.properties,
            externalRefs: model.externalRefs
        }
        filePath = await writeInterface(_interface, model.flat);
        files.push(filePath);
        console.log(chalk.magentaBright('Generated interface!'));
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
        console.log(chalk.magentaBright('Generated class!'));
    }
    if (model.controller.include) {
        const controller: Controller = {
            name: model.name,
            properties: model.controller.properties,
            methods: model.controller.methods,
            externalRefs: model.controller.externalRefs
        }
        filePath = await writeController(controller, model.flat);
        files.push(filePath);
        console.log(chalk.magentaBright('Generated controller files!'));
    }
    if (model.business.include) {
        const business: Business = {
            name: model.name,
            properties: model.business.properties,
            methods: model.business.methods,
            externalRefs: model.business.externalRefs
        }
        filePaths = await writeBusiness(business, model.flat);
        filePaths.forEach((filePath: string) => {
            files.push(filePath);
        });
        console.log(chalk.magentaBright('Generated business files!'));
    }
    if (model.repository.include) {
        const repository: Repository = {
            name: model.name,
            properties: model.repository.properties,
            methods: model.repository.methods,
            externalRefs: model.repository.externalRefs
        }
        filePath = await writeRepository(repository, model.flat);
        files.push(filePath);
        console.log(chalk.magentaBright('Generated repository files!'));
    }
    return files;
}

