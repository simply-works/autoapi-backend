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
    aws_cognito_auth_url:`https://cognito-idp.${process.env.POOL_REGION}.amazonaws.com/${process.env.POOL_ID}/.well-known/jwks.json`,
    serverless_deploy: 'sls deploy',
    stage: process.env.AWS_LAMBDA_STAGE || 'dev',
    cipher_algorithm: 'aes-256-cbc',
    cipher_key: process.env.CIPHER_KEY || '429b43686af188b21bab3629eec4093f',
    cipher_iv: process.env.CIPHER_IV || '7b05882ea2915744cf60cdc96bb82623'
}