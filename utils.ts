export const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

export async function asyncForEach(array: Array<any>, callback: Function) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export const outputCreatedFiles = (filenames: Array<string>) => {
    console.log(`Generated (${filenames.length}) file(s)`);
    for (let filename of filenames) {
        console.log(`- ${filename}`);
    }
}

export const toCamelCase = (name: string) => {
    return name.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();        
    });
}