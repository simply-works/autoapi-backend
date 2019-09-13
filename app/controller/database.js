const databaseService = require('../services/databaseService');
const projectService = require('../services/projectService');
const constants = require('../utils/constants').constants;
const { messages } = constants;
const { createSchemaIfNotExists } = require('../db/dbOperationHelper');
var randomstring = require("randomstring");
let { port, tenantdb_host } = require('../../config/config');
module.exports.getDatabases = async (req, res) => {
	try {
		let query = {};
		if (req.query) {
			query = req.query;
		}
		let allDatabases = await databaseService.getDatabases({}, query, {});
		console.log('database', allDatabases);
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
		return res.status(statusCode).send(body)
	}
	catch (error) {
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}

module.exports.getDatabase = async (req, res) => {
	try {
		let result = await databaseService.getDatabase(req.params);
		console.log('result', result);
		let statusCode = '';
		let body = {};
		if (result && result.body && result.body.length && result.body[0].id) {
			statusCode = result.status;
			body.message = result.message;
			body.database = result.body;
		}
		else {
			statusCode = 400;
			body.message = "Unable to fetch";
		}
		return res.status(statusCode).send(body);
	}
	catch (error) {
		console.log("Error while fetching record", error);
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}

/**
 * create database in a project
 */
module.exports.createDatabase = async (req, res) => {
	try {
		let response = {
			status: 400,
			body: {
				message: messages.BAD_REQUEST
			}
		};
		let path = {
			id: req.body.project_id
		}
		let projectDetails = await projectService.getProject(path, {}, {});
		/**
		 * If project exists in Database for the given project_id
		 */
		if(projectDetails && projectDetails.body && Array.isArray(projectDetails.body) && projectDetails.body.length) {
			req.body.name = (req.body.name).replace(/ /g, '').toLowerCase();
			req.body['schema_name'] = `${projectDetails.body[0].name}_${req.body.name}`;
			req.body['user'] = randomstring.generate({
				length: 5,
				charset: 'alphabetic',
				capitalization: 'lowercase'
			});
			req.body['pass'] = randomstring.generate({
				length: 6,
				charset: 'alphabetic',
				capitalization: 'lowercase'
			});
			req.body['port'] = port;
			req.body['host'] = tenantdb_host;
			let createRecord = await databaseService.createDatabase({}, {}, req.body);
			/**
			 * If row created in `Database` table
			 */
			if (createRecord && createRecord.body && createRecord.body.id) {
				createRecord.project_name = projectDetails.body[0].name;
				createRecord.body.pass = req.body.pass;
				console.log('createedddd',createRecord)
				await createSchemaIfNotExists(createRecord);
				delete createRecord.project_name;	
				delete createRecord.body.user;
				delete createRecord.body.pass;
				delete createRecord.body.schema_name;
				response.body.createdRecord = createRecord.body;
				response.body.message = createRecord.message;
				response.status = createRecord.status;
			} else {
				/**
				 * If row is not created in `Database` table
				 */
				response.status = createRecord.status;
				response.body.message = createRecord.message;
			}
		} else {
			/**
			 * If project does not exists in Database for the given project_id
			 */
			response.status = projectDetails.status;
			response.body.message = projectDetails.message;
		}
		res.status(response.status).send(response.body);
	}
	catch (error) {
		console.log('createDatabase ========= \n\n', error);
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}



module.exports.updateDatabase = async (req, res) => {
	try {
		let updateRecord = await databaseService.updateDatabase(req.params, {}, req.body);
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
		return res.status(statusCode).send(body);
	} catch (error) {
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}

module.exports.deleteDatabase = async (req, res) => {
	try {
		let deletedDatabase = await databaseService.deleteDatabase(req.params);
		console.log('databaseDeleted', deletedDatabase);
		let body = {};
		let statusCode = '';
		statusCode = deletedDatabase.status;
		body = deletedDatabase.message;
		return res.status(statusCode).send(body);
	}
	catch (error) {
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}