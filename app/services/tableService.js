'use strict';

const postgresHelper = require('../db/postgresHelper');
const constants = require('../utils/constants').constants;
const { serviceErrorHanlder } = require('../utils/errorHandler');
const { uniqueNameCheck } = require('../db/dbOperationHelper');

/**
 * Get Tables details from table.
 */
exports.getTables = async (path, query = {}, body) => {
	try {
		let responseObj = {};
		Object.assign(responseObj, constants.defaultServerResponse);
		let results = await postgresHelper.findRecords('Table', query);
		if (results && results.length) {
			console.log('result', results);
			responseObj.body = results;
			responseObj.status = 200;
			responseObj.message = constants.FETCHED_RECORD;
		} else {
			responseObj.message = "No record found";
		}
		return responseObj;
	} catch (error) {
		console.log('Error while getting tables', error);
		return responseObj;
	}
}

/**
 * Get Tables details from table.
 */
exports.getTable = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		let results = await postgresHelper.findRecords('Table', filter);
		if (results && results.length) {
			responseObj.status = 200;
			responseObj.body = results;
			responseObj.message = constants.FETCHED_RECORD;
			return responseObj;
		} else {
			throw new Error("Unable to fetch record");
		}
	} catch (error) {
		return responseObj;
	}
}
/**
 * Create table and save data in table.
 */
exports.createTable = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		/**
		 * check if dbname already exists in `Table` table against project_id
		 * If exists then throw error `Name must be unique` else create row in `Table` table
		 */
		const query = {
            database_id: body.database_id,
            name: body.name
		};
		let { isUniqueName, message, statusCode }= await uniqueNameCheck('Table', query);
		if(isUniqueName) {
			let createdTable = await postgresHelper.createRecord('Table', body);
			console.log('createTable', createdTable);
			if (createdTable && createdTable.id) {
				responseObj.status = 201;
				responseObj.message = "Created successfully";
				responseObj.body = createdTable;
			} else {
				responseObj.message = "Unable to create";
			}
		} else if(statusCode && message) {
			responseObj.status = statusCode;
			responseObj.message = message;
		}
		return responseObj;
	} catch (error) {
		serviceErrorHanlder(error, responseObj);
		return responseObj;
	}
}

/**
 * Update table details
 */
exports.updateTable = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let data = body;
		let filter = {
			id: path.id
		}
		let result = await postgresHelper.updateRecord('Table', data, filter);
		if (result.indexOf(0) === 0) {
			responseObj.message = "Record not found";
			responseObj.status = 404;
		} else {
			responseObj.message = "Record updated successfully"
			responseObj.status = 204;
		}
		return responseObj;
	} catch (error) {
		console.log('Error while updating table', error);
		return responseObj;
	}
}

/**
 * Delete table information.
 */
exports.deleteTable = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		let result = await postgresHelper.deleteRecord('Table', filter);
		console.log('result', result);

		if (result && (result !== 0)) {
			responseObj.status = 204;
			responseObj.message = "Deleted successfully";
		} else {
			responseObj.status = 404;
			responseObj.message = "Record not found";
		}
		return responseObj;
	} catch (error) {
		console.log('Error while deleting table', error);
		return responseObj;
	}
}

exports.updateAwsUrlsInTable = async (Urls, tableInfo) => {
	let data = {};
	let { apiGatewayUrl, lamdaUrl } = Urls;
	data['api_gateway_uri'] = apiGatewayUrl;
	data['lambda_uri'] = lamdaUrl;
	let filter = {
		id: tableInfo.body.id
	}
	let result = await postgresHelper.updateRecord('Table', data, filter);
	if (result.indexOf(0) >= 0) {
		console.log('updated record', result);
		return result;	
	}
	console.log('Success updation');
	return;
}