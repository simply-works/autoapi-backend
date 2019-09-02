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
    schema: config.dbSchema,
    dialect: config.dialect,
    username: config.username,
    password: config.password,
    port: config.port
});
console.log('config',config)
let tableName = config.tableName;
let schema = config.schema;
// schema = schema ? schema : {
//     id: {
//         type: Number,
//         primaryKey: true
//     },
//     name: {
//         type: String
//     }
// }
schema = {
    id: {
        type: "Number",
        primaryKey: true
    },
    name: {
        type: "String"
    }
}

for (let key in schema) {
    schema[key].type = schemaTranslate[schema[key].type];
}
// schema = schema.schemas[0];

// let NewSchema = sequelize.define(tableName,
//     schema
// )
// // Creating table automatically if not exists in db using above model
//  NewSchema.sync({});
// await sequelize.models[tableName].sync({});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

module.exports.createTable = async () => {
    // Creating dynamic model and invoking into sequelize
    let google = await sequelize.define(tableName,
        schema
    )
    // console.log('newschema',NewSchema);
    // Creating table automatically if not exists in db using above model
    await google.sync({});
}