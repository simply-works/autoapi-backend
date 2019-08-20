'use strict';

const postgresHelper = require('../db/postgresHelper');
const constants = require('../utils/constants').constants;
/**
 * Get Projects details from project.
 */
exports.getProjects = async (path, query={}, body) => {
	try {
		let responseObj = {};
		Object.assign(responseObj, constants.defaultServerResponse);
		let results = await postgresHelper.findRecords('Project',query);
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
		console.log('Error while getting projects', error);
		return responseObj;
	}
}

/**
 * Get Projects details from project.
 */
exports.getProject = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		let results = await postgresHelper.findRecords('Project', filter);
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
 * Create project and save data in project.
 */
exports.createProject = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let createdProject = await postgresHelper.createRecord('Project', body);
		console.log('createProject', createdProject);
		if (createdProject && createdProject.id) {
			responseObj.status = 201;
			responseObj.message = "Created successfully";
			responseObj.body = createdProject;
		} else {
			responseObj.message = "Unable to create";
		}
		return responseObj;
	} catch (error) {
		return responseObj;
	}
}

/**
 * Update project details
 */
exports.updateProject = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let data = body;
		let filter = {
			id: path.id
		}
		let result = await postgresHelper.updateRecord('Project', data, filter);
		if (result.indexOf(0) === 0) {
			responseObj.message = "Record not found";
			responseObj.status = 404;
		} else {
			responseObj.message = "Record updated successfully"
			responseObj.status = 204;
		}
		return responseObj;
	} catch (error) {
		console.log('Error while updating project', error);
		return responseObj;
	}
}

/**
 * Delete project information.
 */
exports.deleteProject = async (path, query, body) => {
	let responseObj = {};
	Object.assign(responseObj, constants.defaultServerResponse);
	try {
		let filter = {
			id: path.id
		}
		let result = await postgresHelper.deleteRecord('Project', filter);
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
		console.log('Error while deleting project', error);
		return responseObj;
	}
}