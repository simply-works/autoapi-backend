const databaseService = require('../services/databaseService');
const projectService = require('../services/projectService');
const constants = require('../utils/constants').constants;
const { createSchemaIfNotExists } = require('../db/createDb');

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

module.exports.createDatabase = async (req, res) => {
	try {
		let createRecord = await databaseService.createDatabase({}, {}, req.body);
		console.log('createRecord', createRecord);
		let path = {
			id: createRecord.body.project_id
		}
		let projectDetails = await projectService.getProject(path, {}, {});
		createRecord.project_name = projectDetails.body[0].name;
		console.log('Project Details', projectDetails);
		await createSchemaIfNotExists(createRecord);
		delete createRecord.project_name;
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
		return res.status(statusCode).send(body)
	}
	catch (error) {
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