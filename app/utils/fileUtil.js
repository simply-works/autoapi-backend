const fs = require('fs');

module.exports.replaceTextinFile = async function (filepath, replacement) {
    try {
        let fileData = await fs.readFile(filepath, 'utf8');
        let result = fileData
        for (const [key, value] of Object.entries(replacement)) {
            result = result.replace(key, value);
        }
        
        await fs.writeFile(filepath, result, 'utf8')
    } catch (err) {
        console.log(err);
    }

}
