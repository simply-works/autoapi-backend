const schemaTranslate = require('./typeTranslation');
const { Sequelize } = require('sequelize');

/**
 * Function accept two parameters table name and its schema
 * it will create table using the given schema in postgres db
 * database should  be already present as passed below in database name
 */
exports.createModel = async (tableName, schema) => {
    const sequelize = new Sequelize({
        database: "lamda-example",
        dialect: 'postgres',
        username: 'postgres',
        password: '123456',
        port: 5432
    });
    tableName = tableName ? tableName : "Google";
    tableName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    schema = schema ? schema : `{
        "id": {
            "type":"Integer",
            "primaryKey":"true"
        },
        "name":{
            "type":"String"
        }
    }`

    schema = JSON.parse(schema);
    schema = schema.length ? schema[0] : schema;

    for (let key in schema) {
        schema[key].type = schemaTranslate[schema[key].type];
    }
    // Creating dynamic model and invoking into sequelize
    await sequelize.define(tableName,
        schema
    )
    return sequelize;

    // Creating table automatically if not exists in db using above model
    // await sequelize.models[tableName].sync({});

    // Fethching the records from that table if exist
    // let records = await sequelize.models[tableName].findAll();

    // // Returning fetched record in a format
    // let dataList = [];
    // if (records.length) {
    //     records.map((record) => {
    //         dataList.push(record.dataValues);
    //     });
    //     console.log('datalist', dataList);
    //     return dataList;
    // } else {
    //     return records;
    // }
}
