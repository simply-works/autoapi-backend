const { replaceTextinFile, createNewFile } = require('../utils/fileUtil.js');
const { dialect } = require('../../config/config');
async function createServerlessYML(data) {
    let replacement = [{
        key: "pwd",
        value: data.pass
    },
    {
        key: "user",
        value: data.user
    },
    {
        key: "dbName",
        value: data.name
    },
    {
        key: "host",
        value: data.host
    },
    {
        key: "port",
        value: data.port
    },
    {
        key: "postgres",
        value: 'postgres'
    },
    {
        key: "tableName",
        value: data.tableName
    },
    {
        key: "dialect",
        value: dialect
    }
    ]
    const filePath = '/deployable-app/staticServerless.yml';
    const outputFilePath = '/deployable-app/serverless.yml'
    replaceTextinFile(filePath, outputFilePath, replacement);
}

async function createFunctionsYML(tableName) {
    const filePath = '/deployable-app/app/api/lambdas/crud/staticFunctions.yml';
    const outputFilePath = '/deployable-app/app/api/lambdas/crud/functions.yml';
    let replacement = [{
        key: "<path>",
        value: tableName
    }]
    replaceTextinFile(filePath, outputFilePath, replacement);
}

async function updateTableSchema(schema) {
    const outputFilePath = '/deployable-app/config/tableSchema.js';
    createNewFile(outputFilePath, schema);
}

module.exports = {
    createFunctionsYML,
    createServerlessYML,
    updateTableSchema
}