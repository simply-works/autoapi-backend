'use strict';

const postgresHelper = require('../../db/postgresHelper');
const constants = require('../../utils/constants').constants;
const config = require('../../../config/config');
const {createTable} = require('../../db/createDynamicModel');
// const { serviceErrorHanlder } = require('../../utils/errorHandler');

/**
 * Get all records details from database.
 */
exports.getRecords = async (path, query, body) => {
	let responseObj = {};
	try {
		console.log('inside crudservice getRecords')
		Object.assign(responseObj, constants.defaultServerResponse);

		await createTable();
		let results = await postgresHelper.findRecords(config.tableName);
		console.log('crudservice getRecords result:', results)
		if (results && results.length) {
			console.log('result', results);
			responseObj.body = results;
			responseObj.status = 200;
		} else {
			responseObj.status = 204;
		}
	} catch (error) {
		console.log('Error while getting all records', error);
		responseObj.status = 500;
	}
	return responseObj;
}

/**
 * Get single record by id from database.
 */
exports.getRecordById = async (path, query, body) => {
	let responseObj = {};
	console.log('inside crudservice getRecordById, id:', path.id)
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		await createTable();
		console.log('crudservice getRecordById config.tableName: ', config.tableName)
		let results = await postgresHelper.findRecords(config.tableName, filter);
		console.log('crud service get record by id result:', results)
		if (results && results.length) {
			responseObj.status = 200;
			responseObj.body = results;
		} else {
			responseObj.status = 204;
		}
	} catch (error) {
		console.log('Error while getting record by id:', path.id);
		console.log('error ', error)
		responseObj.status = 500;
	}
	return responseObj;
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
			responseObj.body = createdRecord;
		} else {
			responseObj.status = 500;
		}
	} catch (error) {
		console.log('Error while creating record');
		console.log('error ', error)
		responseObj.status = 500;
	}
	return responseObj;
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
			responseObj.status = 404;
		} else {
			responseObj.status = 204;
		}
		return responseObj;
	} catch (error) {
		console.log('Error while updating record');
		console.log('error ', error)
		responseObj.status = 500;
	}
	return responseObj;
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
		} else {
			responseObj.status = 404;
		}
		return responseObj;
	} catch (error) {
		console.log('Error while deleting record');
		console.log('error ', error)
		responseObj.status = 500;
	}
	return responseObj;
}