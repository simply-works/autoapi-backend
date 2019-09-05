const { replaceTextinFile, createNewFile, createMigration } = require('../utils/fileUtil.js');
const { dialect, tenantdb_database, tenantdb_host, port } = require('../../config/config');
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
        value: tenantdb_database
    },
    {
        key: "schemaName",
        value: data.schema_name
    },
    {
        key: "host",
        value: tenantdb_host
    },
    {
        key: "port",
        value: port
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

async function createTableMigration(schema, tableName) {
    console.log('date.now', new Date().getTime(),tableName);
    let outputFileName = new Date().getTime() + `-create-${tableName}.js`
    const outputFilePath = `/deployable-app/migrations/${outputFileName}`;
    createMigration(outputFilePath, schema, tableName);
}

module.exports = {
    createFunctionsYML,
    createServerlessYML,
    updateTableSchema,
    createTableMigration
}