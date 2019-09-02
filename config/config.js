require('dotenv').config()

module.exports = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    appPort: process.env.PORT || '3000',
    pool_region: process.env.POOL_REGION,
    pool_id:process.env.POOL_ID,
    tenantdb_username: process.env.TENANT_DB_USERNAME,
    tenantdb_password: process.env.TENANT_DB_PASSWORD,
    tenantdb_database: process.env.TENANT_DB_NAME,
    tenantdb_host: process.env.TENANT_DB_HOST,
}