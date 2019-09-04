const util = require('util')
const fs = require('fs');
const yaml = require('js-yaml');
let workingDir = process.cwd();

module.exports.replaceTextinFile = async function (filepath, outputFilePath, replacementArray) {
    try {
        let fileData = yaml.safeLoad(fs.readFileSync(`${workingDir}${filepath}`, 'utf8'));
        let result = fileData
        result = JSON.stringify(result);
        replacementArray.forEach(replacement => {
            let replace = replacement.key;
            let re = new RegExp(replace, "g");
            result = result.replace(re, replacement.value);
        });

        result = JSON.parse(result);
        console.log(util.inspect(result, { showHidden: false, depth: null }))

        await fs.writeFileSync(`${workingDir}${outputFilePath}`, yaml.safeDump(result));
    } catch (err) {
        console.log(err);
    }

}
module.exports.createNewFile = async function (outputFilePath, schema) {
    let file = `module.exports.schemas = ${schema}`;
    await fs.writeFileSync(`${workingDir}${outputFilePath}`, file);
}
