
const { exec } = require('child_process');
const { stage } = require('../../config/config');
module.exports.executeCommand = (command) => {
    console.log('Running serverless deploy......');
    command = `cd deployable-app && ${command}`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
                resolve(getApiGetwayUri(stdout));
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(stderr);
            }
        });
    })
};

function getApiGetwayUri(stdout) {
    let response = {};
    let result = stdout.split('\n');
    for (let index=0; index < result.length; index++) {
        if (result[index].search('https') > -1) {
            let url = result[index].split('- ');
            url = url[1];
            response['lamdaUrl'] = url;
            response['apiGatewayUrl'] = url.split(`/${stage}`)[0];
        } else if (result[index].search('api keys:') > -1) {
            index++;
            response['encryptedApiKey'] = result[index].substring(result[index].indexOf(': ') + 2, result[index].length)
        }
    }
    
    return Urls;
}
