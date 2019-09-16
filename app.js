'use strict';
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var fs = require('fs')
const { appPort, database, username, password, host, tenantdb_database, tenantdb_username, tenantdb_password, tenantdb_host } = require('./config/config');
var routePath = './app/routes/';
var app = express();
const { validate } = require('./app/middleware/authController');
const { createDBIfNotExists } = require('./app/db/dbOperationHelper');
var cors = require('cors');

app.use(cors())

// parse application/json
app.use(bodyParser.json())

let loggerOption = (process.env.NODE_ENV === 'production') ? 'common' : 'dev';
app.use(logger(loggerOption));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());

app.use((req, res, next) => {
	if(req.method !== "OPTIONS") {
		validate(req, res, next);
	}
	else next();
});
app.get('/', function (req, res) {
	res.status(200).send('Welcome');
});
fs.readdirSync(routePath).forEach((file) => {
	let route = routePath + file;
	require(route)(app);
});
app.listen(appPort, async () => {
	/**
	 * Create Admin database if not exists
	 */
	await createDBIfNotExists(database, username, password, host);
	/**
	 * Create tenant database if not exists
	 */
	await createDBIfNotExists(tenantdb_database, tenantdb_username, tenantdb_password, tenantdb_host);
	console.log('Express server listening on port', appPort)
});
module.exports = app;
