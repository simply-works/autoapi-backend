'use strict';
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var fs = require('fs')
const { appPort } = require('./config/config');
var routePath = './app/routes/';
var app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
		.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

fs.readdirSync(routePath).forEach((file) => {
	let route = routePath + file;
	require(route)(app);
});
app.listen(appPort, () => console.log('Express server listening on port', appPort));
module.exports = app;
