'use strict';

const postgresHelper = require('../db/postgresHelper');
const constants = require('../utils/constants').constants;
const { serviceErrorHanlder } = require('../utils/errorHandler');
/**
 * Get Databases details from database.
 */
exports.getDatabases = async (path, query={}, body) => {
	try {
		let responseObj = {};
		Object.assign(responseObj, constants.defaultServerResponse);
		let results = await postgresHelper.findRecords('Database',query);
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
		console.log('Error while getting databases', error);
		return responseObj;
	}
}

/**
 * Get Databases details from database.
 */
exports.getDatabase = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		let results = await postgresHelper.findRecords('Database', filter);
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
 * Create database and save data in database.
 */
exports.createDatabase = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let createdDatabase = await postgresHelper.createRecord('Database', body);
		if (createdDatabase && createdDatabase.id) {
			responseObj.status = 201;
			responseObj.message = "Created successfully";
			responseObj.body = createdDatabase;
		} else {
			responseObj.message = "Unable to create";
		}
		return responseObj;
	} catch (error) {
		serviceErrorHanlder(error, responseObj);
		return responseObj;
	}
}

/**
 * Update database details
 */
exports.updateDatabase = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let data = body;
		let filter = {
			id: path.id
		}
		let result = await postgresHelper.updateRecord('Database', data, filter);
		if (result.indexOf(0) === 0) {
			responseObj.message = "Record not found";
			responseObj.status = 404;
		} else {
			responseObj.message = "Record updated successfully"
			responseObj.status = 204;
		}
		return responseObj;
	} catch (error) {
		console.log('Error while updating database', error);
		return responseObj;
	}
}

/**
 * Delete database information.
 */
exports.deleteDatabase = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		let result = await postgresHelper.deleteRecord('Database', filter);
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
		console.log('Error while deleting database', error);
		return responseObj;
	}
}