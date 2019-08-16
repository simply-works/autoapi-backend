require('dotenv').config()
const schema = require('./tableSchema.json')

module.exports = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    tableName: process.env.TABLE_NAME,
    schema: schema
}