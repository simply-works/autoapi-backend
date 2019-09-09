
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
    let Urls = {};
    let result = stdout.split('\n');
    let value = '';
    let index = 0;
    for (index; index < result.length; index++) {
        if (result[index].search('https') > -1) {
            let uri = '';
            uri = result[index].search('https');
            value = result[index].split('- ');
            value = value[1];
            break;
        }
    }
    Urls['lamdaUrl'] = value;
    Urls['apiGatewayUrl'] = value.split(`/${stage}`)[0];
    return Urls;
}
