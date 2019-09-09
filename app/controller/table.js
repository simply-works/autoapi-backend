const tableService = require('../services/tableService');
const { getDatabase } = require('../services/databaseService');
const constants = require('../utils/constants').constants;
var randomstring = require("randomstring");
const { serverless_deploy } = require('../../config/config')
const {
	createFunctionsYML,
	createServerlessYML,
	updateTableSchema
} = require('../awsautomation/lambdaGeneration');
const { executeCommand } = require('../utils/command');
module.exports.getTables = async (req, res) => {
	try {
		let query = {};
		if (req.query) {
			query = req.query;
		}
		let allTables = await tableService.getTables({}, query, {});
		console.log('tables', allTables);
		let body = {};
		let statusCode = '';
		if (allTables.body && allTables.body.length && allTables.body[0].id) {
			statusCode = allTables.status;
			body.message = allTables.message;
			body.tables = allTables.body
		}
		else {
			statusCode = 400;
			body.message = "Record not found";
		}
		return res.status(statusCode).send(body);
	}
	catch (error) {
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}

module.exports.getTable = async (req, res) => {
	try {
		let result = await tableService.getTable(req.params);
		console.log('result', result);
		let statusCode = '';
		let body = {};
		if (result && result.body && result.body.length && result.body[0].id) {
			statusCode = result.status;
			body.message = result.message;
			body.table = result.body;
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

module.exports.createTable = async (req, res) => {
	try {
		let path = { id: req.body.database_id }
		let databaseDetails = await getDatabase(path);
		databaseDetails = databaseDetails.body[0];
		databaseDetails.tableName = req.body.name;
		databaseDetails.schema_name = databaseDetails.schema_name.replace(/_/g, "-");
		databaseDetails.serviceName = `${databaseDetails.schema_name}-${req.body.name}`
		databaseDetails.apiKeyValue = randomstring.generate({
			length: 16,
			charset: 'alphabetic'
		});
		req.body.service_name = databaseDetails.serviceName;
		req.body.api_key_value = databaseDetails.apiKeyValue;
		let createRecord = await tableService.createTable({}, {}, req.body);
		console.log('createRecord', createRecord);
		let body = {};
		let statusCode = '';
		if (createRecord && createRecord.body && createRecord.body.id && createRecord.body.name) {
			await createFunctionsYML(createRecord.body.name);
			await createServerlessYML(databaseDetails);
			await updateTableSchema(createRecord.body.schema);
			body.createdRecord = createRecord.body;
			statusCode = createRecord.status;
			body.message = createRecord.message;
			let Urls = await executeCommand(serverless_deploy);
			if (!Urls) {
				statusCode = 500;
				body.message = "Error while creating record";
			}
			await tableService.updateAwsUrlsInTable(Urls, createRecord);
		} else {
			statusCode = 500;
			body.message = "Error while creating record"
		}
		return res.status(statusCode).send(body);
	}
	catch (error) {
		console.log('error', error);
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}



module.exports.updateTable = async (req, res) => {
	try {
		let updateRecord = await tableService.updateTable(req.params, {}, req.body);
		console.log('tableUpdate', updateRecord);
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

module.exports.deleteTable = async (req, res) => {
	try {
		let deletedTable = await tableService.deleteTable(req.params);
		console.log('tableDeleted', deletedTable);
		let body = {};
		let statusCode = '';
		statusCode = deletedTable.status;
		body = deletedTable.message;
		return res.status(statusCode).send(body);
	}
	catch (error) {
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);  
	}
}