'use strict';

const Sequelize = require('sequelize');
const config = require('../../config/config');


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
        // Fetching and checking whether the passed database exists or not
        await sequelize.query(`SELECT datname FROM pg_database WHERE datistemplate = false and datname = '${database}';`).then(data => {
            if (data) {
                exists = true;
            }
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

module.exports.createSchemaIfNotExists = async (databaseDetails) => {
    let database = config.tenantdb_database;
    let username = config.tenantdb_username;
    let password = config.tenantdb_password;
    let dbHost = config.tenantdb_host;
    // let shcemaName = `${databaseDetails.project_name}_${databaseDetails.body.name}_123`;
    let schemaName = databaseDetails.body.schema_name;
    let schemaUser = databaseDetails.body.user;
    let schemaPassword = databaseDetails.body.pass;
    console.log('databaseDetails',databaseDetails)
    let sequelize;
    try {
        console.log('databaseDetails323')
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

        // Create new schema if not exists already
        await sequelize.createSchema(schemaName).then(data => {
            console.log('createdschema', data);
            return true;
        }).catch(error => {
            console.log('error', error);
        });

        //create role john with login password 'john'
        await sequelize.query(`CREATE USER ${schemaUser} WITH ENCRYPTED PASSWORD '${schemaPassword}';`).then(data => {
            console.log('create user queru', data);
        }).catch(error => {
            console.log('error', error);
        })

        await sequelize.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${schemaName} TO ${username};`).then(data => {
            console.log('create user queruffdfd', data);
        }).catch(error => {
            console.log('error', error)
        });

        // await sequelize.query('select * from lab1.persons;').then(data => {
        //     console.log('create user queruffd', data)
        // }).catch(error => {
        //     console.log('error', error)
        // });
        // console.log('cool')



        // await sequelize.query('grant usage on schema autoapi to username;').then(data => {
        //     console.log('create user queru', data)
        // }).catch(error => {
        //     console.log('error', error)
        // })


    }
    catch (error) {
        console.log('error',error);
        return;
    }
}
