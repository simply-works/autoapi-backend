const crudService = require('../../services/crudService');
const constants = require('../../../utils/constants').constants;

module.exports.createRecord = async (event, context) => {
    try {
        let createRecord = await crudService.createRecord({}, {}, JSON.parse(event.body));
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

module.exports.getAllRecords = async (event, context) => {
    try {
        let allRecords = await crudService.getRecords();
        console.log('recordCreate', allRecords);
        let body = {};
        let statusCode = '';
        if (allRecords.body && allRecords.body.length && allRecords.body[0].id) {
            statusCode = allRecords.status;
            body.message = allRecords.message;
            body.records = allRecords.body
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

module.exports.getRecordById = async (event, context) => {
    try {
        let result = await crudService.getRecordById(event.pathParameters);
        console.log('result', result);
        let statusCode = '';
        let body = {};
        if (result && result.body && result.body[0].id) {
            body.message = result.message;
            body.record = result.body;
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

module.exports.updateRecord = async (event, context) => {
    try {
        let updateRecord = await crudService.updateRecord(event.pathParameters, {}, JSON.parse(event.body));
        console.log('recordUpdate', updateRecord);
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

module.exports.deleteRecord = async (event, context) => {
    try {
        let deletedRecords = await crudService.deleteRecord(event.pathParameters);
        console.log('recordDeleted', deletedRecords);
        let body = {};
        let statusCode = '';
        // if(deletedRecords.status && (deletedRecords === 204)){
        statusCode = deletedRecords.status;
        body = deletedRecords.message;
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