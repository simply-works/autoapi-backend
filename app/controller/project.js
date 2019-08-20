const projectService = require('../services/projectService');
const constants = require('../utils/constants').constants;
module.exports.getProjects = async (req, res) => {
	try {
		let query = {};
		if(req.query){	
			query = req.query;
		}
		let allProjects = await projectService.getProjects({},query,{});
		console.log('projects', allProjects);
		let body = {};
		let statusCode = '';
		if (allProjects.body && allProjects.body.length && allProjects.body[0].id) {
			statusCode = allProjects.status;
			body.message = allProjects.message;
			body.projects = allProjects.body
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

module.exports.getProject = async (req, res) => {
	try {
		let result = await projectService.getProject(req.params);
		console.log('result', result);
		let statusCode = '';
		let body = {};
		if (result && result.body && result.body.length && result.body[0].id) {
			statusCode = result.status;
			body.message = result.message;
			body.project = result.body;
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

module.exports.createProject = async (req, res) => {
	try {
		let createRecord = await projectService.createProject({}, {}, req.body);
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
		return res.status(statusCode).send(body);
	}
	catch (error) {
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}



module.exports.updateProject = async (req, res) => {
	try {
		let updateRecord = await projectService.updateProject(req.params, {}, req.body);
		console.log('projectUpdate', updateRecord);
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

module.exports.deleteProject = async (req, res) => {
	try {
		let deletedProject = await projectService.deleteProject(req.params);
		console.log('projectDeleted', deletedProject);
		let body = {};
		let statusCode = '';
		statusCode = deletedProject.status;
		body = deletedProject.message;
		return res.status(statusCode).send(body);
	}
	catch (error) {
		return res.status(error.status).send(error.message ? error.message : constants.DEFAULT_ERROR);
	}
}