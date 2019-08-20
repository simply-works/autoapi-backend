'use strict';
var express = require('express');
var router = express.Router();
var projectController = require('../controller/project');

router.post('/', projectController.createProject);

router.get('/', projectController.getProjects);

router.put('/:id', projectController.updateProject);

router.get('/:id', projectController.getProject);

router.delete('/:id', projectController.deleteProject);


module.exports = (app) => {
	app.use('/projects', router);
}