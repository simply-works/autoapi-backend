const schemaTranslate = require('./typeTranslation');
// const { Sequelize } = require('sequelize');
const Sequelize = require('sequelize');
const config = require('../../config/config');

/**
 * Function accept two parameters table name and its schema
 * it will create table using the given schema in postgres db
 * database should  be already present as passed below in database name
 */
module.exports = async () => {
    const sequelize = new Sequelize({
        database: config.database,
        dialect: config.dialect,
        username: config.username,
        password: config.password,
        port: config.port
    });
    // tableName = tableName ? tableName : "Google";
    // tableName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    let tableName = config.tableName
    let schema = config.schema
    schema = schema ? schema : {
        id: {
            type: Integer,
            primaryKey: true
        },
        name:{
            type: String
        }
    }

    // schema = JSON.parse(schema);
    // schema = schema.length ? schema[0] : schema;

    for (let key in schema) {
        schema[key].type = schemaTranslate[schema[key].type];
    }
    // Creating dynamic model and invoking into sequelize
    await sequelize.define(tableName,
        schema
    )
    // Creating table automatically if not exists in db using above model
    // await sequelize.models[tableName].sync({});
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
}
