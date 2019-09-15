const crudService = require('../../services/crudService');
const constants = require('../../../utils/constants').constants;

module.exports.createRecord = async (event, context) => {
    try {
        let result = await crudService.createRecord({}, {}, JSON.parse(event.body));
        console.log('create record result in handler', result);
        let body = {};
        let statusCode = '';
        if (result) {
            body = result.body;
            if (result.status) {
                statusCode = result.status;
            }
        } else {
            statusCode = 500;
            body = "Error while creating record"
        }
        return {
            statusCode,
            body: JSON.stringify(body),
        }
    }
    catch (error) {
        console.log("Error while creating record", error);
        return {
            statusCode: 500,
            body: "Error while creating record"
        }
    }
}

module.exports.getAllRecords = async (event, context) => {
    try {
        let allRecords = await crudService.getRecords();
        console.log('allRecords result in handler', allRecords);
        let body = {};
        let statusCode;
        if (allRecords.body && allRecords.body.length && allRecords.body[0].id) {
            statusCode = allRecords.status;
            if (allRecords.body) {
                body = allRecords.body
            }
        }
        else {
            statusCode = 204;
            body = "Record not found";
        }
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    }
    catch (error) {
        console.log("Error while getting all records", error);
        return {
            statusCode: 500,
            body: "Error while getting all records"
        }
    }
}

module.exports.getRecordById = async (event, context) => {
    try {
        console.log('-------getRecordById------------');
        let result = await crudService.getRecordById(event.pathParameters);
        console.log('getRecordById result', result);
        let statusCode = '';
        let body = {};
        if (result) {
            statusCode = result.status;
            if (result.body) {
                body = result.body;
            }
        }
        else {
            statusCode = 204;
            body = "Record not found";
        }
        return {
            statusCode,
            body: JSON.stringify(body),
        }
    }
    catch (error) {
        console.log("Error while getting record by id", error);
        return {
            statusCode: 500,
            body: "Error while getting record by id"
        }
    }
}

module.exports.updateRecord = async (event, context) => {
    try {
        let updateRecord = await crudService.updateRecord(event.pathParameters, {}, JSON.parse(event.body));
        console.log('update record handler, updated record: ', updateRecord);
        let statusCode = 500;
        let body = {};
        if (updateRecord) {
            statusCode = updateRecord.status;
            if (updateRecord.body){
                body = updateRecord.body;
            }
        } else {
            statusCode = 500;
            body = "Error in update record";
        }
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    } catch (error) {
        console.log("Error while updating record", error);
        return {
            statusCode: 500,
            body: "Error while updating record"
        }
    }
}

module.exports.deleteRecord = async (event, context) => {
    try {
        let deletedRecords = await crudService.deleteRecord(event.pathParameters);
        console.log('recordDeleted', deletedRecords);
        let body = {};
        let statusCode = 500;
        if(deletedRecords.status){
            statusCode = deletedRecords.status;
        }
        if (deletedRecords.body) {
            body = deletedRecords.body;
        }
        // }
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    }
    catch (error) {
        console.log("Error while deleting record", error);
        return {
            statusCode: 500,
            body: "Error while deleting record"
        }
    }
}