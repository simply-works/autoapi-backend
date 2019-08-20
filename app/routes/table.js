'use strict';
var express = require('express');
var router = express.Router();
var tableController = require('../controller/table');

router.post('/', tableController.createTable);

router.get('/', tableController.getTables);

router.put('/:id', tableController.updateTable);

router.get('/:id', tableController.getTable);

router.delete('/:id', tableController.deleteTable);


module.exports = (app) => {
	app.use('/tables', router);
}