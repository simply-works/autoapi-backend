'use strict';
var express = require('express');
var router = express.Router();
var databaseController = require('../controller/database');

router.post('/', databaseController.createDatabase);

router.get('/', databaseController.getDatabases);

router.put('/:id', databaseController.updateDatabase);

router.get('/:id', databaseController.getDatabase);

router.delete('/:id', databaseController.deleteDatabase);


module.exports = (app) => {
	app.use('/databases', router);
}