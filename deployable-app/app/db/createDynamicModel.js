const schemaTranslate = require('./typeTranslation');
// const { Sequelize } = require('sequelize');
const Sequelize = require('sequelize');
const config = require('../../config/config');

/**
 * Creating models dynamically and defining into sequelize
 */
const db = {};
const sequelize = new Sequelize({
    database: config.database,
    dialect: config.dialect,
    username: config.username,
    password: config.password,
    port: config.port
});
let tableName = config.tableName;
let schema = config.schema;
schema = schema ? schema : {
    id: {
        type: Number,
        primaryKey: true
    },
    name: {
        type: String
    }
}

for (let key in schema) {
    schema[key].type = schemaTranslate[schema[key].type];
}

schema = schema.schemas[0];
// Creating dynamic model and invoking into sequelize
sequelize.define(tableName,
    schema
)
// Creating table automatically if not exists in db using above model
// await sequelize.models[tableName].sync({});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

