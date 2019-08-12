const projectService = require('../../services/projectService');
const constants = require('../../../utils/constants').constants;


module.exports.getProjects = async (event, context) => {
    try {
        let allProjects = await projectService.getProjects();
        console.log('projectCreate', allProjects);
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
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    }
    catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message ? error.message : constants.DEFAULT_ERROR)
        }
    }
}

module.exports.getProject = async (event, context) => {
    try {
        let result = await projectService.getProject(event.pathParameters);
        console.log('result', result);
        let statusCode = '';
        let body = {};
        if (result && result.body && result.body[0].id) {
            body.message = result.message;
            body.project = result.body;
        }
        else {
            statusCode = 400;
            body.message = "Unable to fetch";
        }
        return {
            statusCode,
            body: JSON.stringify(body),
        }
    }
    catch (error) {
        console.log("Error while fetching record", error);
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message),
        }
    }
}

module.exports.createProject = async (event, context) => {
    try {
        let createRecord = await projectService.createProject({}, {}, JSON.parse(event.body));
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
        return {
            statusCode,
            body: JSON.stringify(body),
        }
    }
    catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message)
        }
    }
}



module.exports.updateProject = async (event, context) => {
    try {
        let updateRecord = await projectService.updateProject(event.pathParameters, {}, JSON.parse(event.body));
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
        console.log('body', body);
        console.log('status', statusCode)
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    } catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message)
        }
    }
}

module.exports.deleteProject = async (event, context) => {
    try {
        let deletedProject = await projectService.deleteProject(event.pathParameters);
        console.log('projectDeleted', deletedProject);
        let body = {};
        let statusCode = '';
        // if(deletedProject.status && (deletedProject === 204)){
        statusCode = deletedProject.status;
        body = deletedProject.message;
        // }
        return {
            statusCode,
            body: JSON.stringify(body)
        }
    }
    catch (error) {
        return {
            statusCode: error.status,
            body: JSON.stringify(error.message)
        }
    }
}