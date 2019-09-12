'use strict';

const Sequelize = require('sequelize');
const config = require('../../config/config');
const { findRecords } = require('../db/postgresHelper');
const { messages } = require('../utils/constants').constants;
let dialect = config.dialect;
let dbPort = config.port;

module.exports.createDBIfNotExists = async () => {
    let database = config.database;
    let username = config.username;
    let password = config.password;
    let dbHost = config.host;

    let sequelize;
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
        /**
         * Fetching and checking whether the passed database exists or not
         */
        const databaseData = await sequelize.query(`SELECT datname FROM pg_database WHERE datistemplate = false and datname = '${database}';`);
        if (databaseData && Array.isArray(databaseData) && databaseData.length && databaseData[0] && Array.isArray(databaseData[0]) && databaseData[0].length) {
            exists = true;
        }
        if (!exists) {
            /**
             * Create new if db not exists
             */
            await sequelize.query(`CREATE DATABASE ${database}`);
        }
    }
    catch (error) {
        return;
    }
}

module.exports.createSchemaIfNotExists = async (databaseDetails) => {
    let database = config.tenantdb_database;
    let username = config.tenantdb_username;
    let password = config.tenantdb_password;
    let dbHost = config.tenantdb_host;
    // let shcemaName = `${databaseDetails.project_name}_${databaseDetails.body.name}_123`;
    let schemaName = databaseDetails.body.schema_name;
    let schemaUser = databaseDetails.body.user;
    let schemaPassword = databaseDetails.body.pass;
    console.log('databaseDetails', databaseDetails)
    let sequelize;
    try {
        sequelize = new Sequelize(database, username, password, {
            host: dbHost,
            port: dbPort,
            dialect: dialect,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });

        await sequelize.query(`CREATE USER ${schemaUser} WITH PASSWORD '${schemaPassword}';`).then(data => {
            console.log('create user queru', data);
        }).catch(error => {
            console.log('error', error);
        })

        await sequelize.query(`GRANT CONNECT ON DATABASE ${database} TO ${schemaUser};`).then(data => {
            console.log('grant connect on database', data);
        })
        // Create new schema if not exists already
        await sequelize.createSchema(schemaName).then(data => {
            console.log('createdschema', data);
            // return true;
        }).catch(error => {
            console.log('error', error);
        });

        await sequelize.query(`GRANT ALL ON SCHEMA ${schemaName} TO ${schemaUser};`).then(data => {
            console.log('create user queru', data)
        }).catch(error => {
            console.log('error', error)
        })
        await sequelize.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${schemaName} TO ${schemaUser};`).then(data => {
            console.log('create user queruffdfd', data);
        }).catch(error => {
            console.log('error', error)
        });
    }
    catch (error) {
        console.log('error', error);
        return;
    }
};

module.exports.uniqueNameCheck = async (tableName, query) => {
    try {
        let isUniqueName = true;
        let message = `Name ${messages.UNIQUE_CONSTRAINT_SUCCESS}`;
        let statusCode = 200;

        const data = await findRecords(tableName, query);
        console.log('data &&&&&&&&&&&&& \n\n', data);
        if(data && data.length) {
            isUniqueName = false;
            statusCode = 409;
            message = `Name ${messages.UNIQUE_CONSTRAINT}`;
        }
        return {
            isUniqueName,
            message,
            statusCode
        };
    } catch (error) {
        console.log('uniqueNameCheck )))))))))) \n\n', error);
        return error;
    }
};

