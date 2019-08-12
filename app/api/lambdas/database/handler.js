const databaseService = require('../../services/databaseService');
const constants = require('../../../utils/constants').constants;


module.exports.getDatabases = async (event, context) => {
    try {
        let allDatabases = await databaseService.getDatabases();
        console.log('databaseCreate', allDatabases);
        let body = {};
        let statusCode = '';
        if (allDatabases.body && allDatabases.body.length && allDatabases.body[0].id) {
            statusCode = allDatabases.status;
            body.message = allDatabases.message;
            body.databases = allDatabases.body
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

module.exports.getDatabase = async (event, context) => {
    try {
        let result = await databaseService.getDatabase(event.pathParameters);
        console.log('result', result);
        let statusCode = '';
        let body = {};
        if (result && result.body && result.body[0].id) {
            body.message = result.message;
            body.database = result.body;
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

module.exports.createDatabase = async (event, context) => {
    try {
        let createRecord = await databaseService.createDatabase({}, {}, JSON.parse(event.body));
        console.log('createRecord', createRecord);
        let body = {};
        let statusCode = '';
        if (createRecord && createRecord.body && createRecord.body.id) {
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



module.exports.updateDatabase = async (event, context) => {
    try {
        let updateRecord = await databaseService.updateDatabase(event.pathParameters, {}, JSON.parse(event.body));
        console.log('databaseUpdate', updateRecord);
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

module.exports.deleteDatabase = async (event, context) => {
    try {
        let deletedDatabase = await databaseService.deleteDatabase(event.pathParameters);
        console.log('databaseDeleted', deletedDatabase);
        let body = {};
        let statusCode = '';
        // if(deletedDatabase.status && (deletedDatabase === 204)){
        statusCode = deletedDatabase.status;
        body = deletedDatabase.message;
        // }
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