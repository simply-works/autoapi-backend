'use strict';
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var fs = require('fs')
const { appPort } = require('./config/config');
var routePath = './app/routes/';
var app = express();
const { Validate } = require('./app/middleware/authController');
const { createDBIfNotExists,createSchemaIfNotExists } = require('./app/db/dbOperationHelper');

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
		.header("Access-Control-Allow-Headers", "*")
		.header("Access-Control-Allow-Methods", "*")
	next();
});

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
	console.log('req.method',req.method,req.methods)
	if(req.method !== "OPTIONS"){
	Validate(req, res, next);
}
else next();
});
app.get('/', function (req, res) {
	res.status(200).send('Welcome');
})
fs.readdirSync(routePath).forEach((file) => {
	let route = routePath + file;
	require(route)(app);
});
app.listen(appPort, async () => {
	// Create database if not exists already
	await createDBIfNotExists();
	// await createSchemaIfNotExists();
	console.log('Express server listening on port', appPort)
});
module.exports = app;
