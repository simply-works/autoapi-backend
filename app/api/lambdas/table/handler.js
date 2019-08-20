const tableService = require('../../services/tableService');
const { getDatabase } = require('../../services/databaseService');
const constants = require('../../../utils/constants').constants;
const {
    createFunctionsYML,
    createServerlessYML,
    updateTableSchema
} = require('../../../awsautomation/lambdaGeneration');


module.exports.getTables = async (event, context) => {
    try {
        let allTables = await tableService.getTables();
        console.log('tableCreate', allTables);
        let body = {};
        let statusCode = '';
        if (allTables.body && allTables.body.length && allTables.body[0].id) {
            statusCode = allTables.status;
            body.message = allTables.message;
            body.tables = allTables.body
        }
        else {
            statusCode = 400;
            body.message = "Record not found";
        }
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    }
    catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message ? error.message : constants.DEFAULT_ERROR)
        }
    }
}

module.exports.getTable = async (event, context) => {
    try {
        let result = await tableService.getTable(event.pathParameters);
        console.log('result', result);
        let statusCode = '';
        let body = {};
        if (result && result.body && result.body[0].id) {
            body.message = result.message;
            body.table = result.body;
        }
        else {
            statusCode = 400;
            body.message = "Unable to fetch";
        }
        return {
            statusCode,
            body: JSON.stringify(body),
        }
    }
    catch (error) {
        console.log("Error while fetching record", error);
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message),
        }
    }
}

module.exports.createTable = async (event, context) => {
    try {
        let createRecord = await tableService.createTable({}, {}, JSON.parse(event.body));
        console.log('createRecord', createRecord);
        let body = {};
        let statusCode = '';
        if (createRecord && createRecord.body && createRecord.body.id && createRecord.body.name) {
            await createFunctionsYML(createRecord.body.name);
            // fething database details for the table
            let path = { id: createRecord.body.database_id }
            let databaseDetails = await getDatabase(path);
            databaseDetails = databaseDetails.body[0];
            databaseDetails.tableName = createRecord.body.name;
            await createServerlessYML(databaseDetails);
            await updateTableSchema(createRecord.body.schema);
            body.createdRecord = createRecord.body;
            statusCode = createRecord.status;
            body.message = createRecord.message;
        } else {
            statusCode = 500;
            body.message = "Error while creating record"
        }
        return {
            statusCode,
            body: JSON.stringify(body),
        }
    }
    catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message)
        }
    }
}



module.exports.updateTable = async (event, context) => {
    try {
        let updateRecord = await tableService.updateTable(event.pathParameters, {}, JSON.parse(event.body));
        console.log('tableUpdate', updateRecord);
        let statusCode = '';
        let body = {};
        if (updateRecord && (updateRecord.status === 204)) {
            statusCode = updateRecord.status;
            body.message = updateRecord.message;
        } else {
            statusCode = updateRecord.status;
            body.message = updateRecord.message;
        }
        console.log('body', body);
        console.log('status', statusCode)
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    } catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message)
        }
    }
}

module.exports.deleteTable = async (event, context) => {
    try {
        let deletedTable = await tableService.deleteTable(event.pathParameters);
        console.log('tableDeleted', deletedTable);
        let body = {};
        let statusCode = '';
        statusCode = deletedTable.status;
        body = deletedTable.message;
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    }
    catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message)
        }
    }
}