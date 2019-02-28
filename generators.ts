import { Model, Interface, Class, Controller, Business, Repository } from "./interfaces";
import { writeModelInterface, writeModelClass, writeModelController, writeModelBusiness, writeModelRepository, writeControllerFiles, writeBusinessFiles, writeRepositoryFiles } from "./writers";
import chalk from "chalk";

export const generateGenericServerFiles = async () => {
    let files: Array<string> = [];
    files = [
        ...(await writeControllerFiles()),
        ...(await writeBusinessFiles()),
        ...(await writeRepositoryFiles())
    ];
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
        filePath = await writeModelInterface(_interface, model.flat);
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
        filePath = await writeModelClass(_class, model.flat);
        files.push(filePath);
        console.log(chalk.magentaBright('Generated model class!'));
    }
    if (model.controller.include) {
        const controller: Controller = {
            name: model.name,
            properties: model.controller.properties,
            methods: model.controller.methods,
            externalRefs: model.controller.externalRefs
        }
        filePath = await writeModelController(controller, model.flat);
        files.push(filePath);
        console.log(chalk.magentaBright('Generated model controller files!'));
    }
    if (model.business.include) {
        const business: Business = {
            name: model.name,
            properties: model.business.properties,
            methods: model.business.methods,
            externalRefs: model.business.externalRefs
        }
        filePaths = await writeModelBusiness(business, model.flat);
        filePaths.forEach((filePath: string) => {
            files.push(filePath);
        });
        console.log(chalk.magentaBright('Generated model business files!'));
    }
    if (model.repository.include) {
        const repository: Repository = {
            name: model.name,
            properties: model.repository.properties,
            methods: model.repository.methods,
            externalRefs: model.repository.externalRefs
        }
        filePath = await writeModelRepository(repository, model.flat);
        files.push(filePath);
        console.log(chalk.magentaBright('Generated model repository files!'));
    }
    return files;
}

