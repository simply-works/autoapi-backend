'use strict';

const Sequelize = require('sequelize');
const config = require('../../config/config');

let database = process.env.DATABASE || config.database;
let username = process.env.DB_USERNAME || config.username;
let password = process.env.DB_PASSWORD || config.password;
let dbHost = process.env.DB_HOST || config.host;
let dialect = config.dialect;
let dbPort = process.env.DB_PORT || config.port;

let sequelize;
module.exports.createDBIfNotExists = async () => {
    try {
        sequelize = new Sequelize("postgres", username, password, {
            host: dbHost,
            port: dbPort,
            dialect: dialect,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
        let exists;
        // Fetching and checking whether the passed database exists or not
        await sequelize.query(`SELECT datname FROM pg_database WHERE datistemplate = false;`).then(data => {
            exists = data[0].find(e => e.datname === database);
            console.log('exists', exists);
        });
        if (!exists) {
            // Create new if not exists already
            await sequelize.query(`CREATE DATABASE ${database}`).then(data => {
                console.log('dbcreated', data);
                return true;
            });
        }
    }
    catch (error) {
        return;
    }
}