'use strict';

const postgresHelper = require('../../db/postgresHelper');
const constants = require('../../utils/constants').constants;
const config = require('../../../config/config');
const {createTable} = require('../../db/createDynamicModel');
/**
 * Get all records details from database.
 */
exports.getRecords = async (path, query, body) => {
	try {
		let responseObj = {};
		Object.assign(responseObj, constants.defaultServerResponse);
		console.log('done done ')

		await createTable();
		// return
		let results = await postgresHelper.findRecords(config.tableName);
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
		console.log('Error while getting records', error);
		return responseObj;
	}
}

/**
 * Get single record by id from database.
 */
exports.getRecordById = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		let results = await postgresHelper.findRecords(config.tableName, filter);
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
 * Create record in database.
 */
exports.createRecord = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		await createTable();

		let createdRecord = await postgresHelper.createRecord(config.tableName, body);
		if (createdRecord && createdRecord.id) {
			responseObj.status = 201;
			responseObj.message = "Created successfully";
			responseObj.body = createdRecord;
		} else {
			responseObj.message = "Unable to create";
		}
		return responseObj;
	} catch (error) {
		return responseObj;
	}
}

/**
 * Update record details
 */
exports.updateRecord = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let data = body;
		let filter = {
			id: path.id
		}
		await createTable();

		let result = await postgresHelper.updateRecord(config.tableName, data, filter);
		if (result.indexOf(0) === 0) {
			responseObj.message = "Record not found";
			responseObj.status = 404;
		} else {
			responseObj.message = "Record updated successfully"
			responseObj.status = 204;
		}
		return responseObj;
	} catch (error) {
		console.log('Error while updating record', error);
		return responseObj;
	}
}

/**
 * Delete record
 */
exports.deleteRecord = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		await createTable();

		console.log('config.tableName',config.tableName, filter);
		let result = await postgresHelper.deleteRecord(config.tableName, filter);
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
		console.log('Error while deleting record', error);
		return responseObj;
	}
}