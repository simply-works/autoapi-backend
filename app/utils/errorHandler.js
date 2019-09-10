/**
 * constants
 */
const { SERVER_ERROR, messages } = require('../utils/constants').constants;

/**
 * Set database error statusCode and message
 * @param {Object} e error object returned by sequelize
 */
module.exports.databaseErrorHandler = (e) => {
    const error = {
        message: SERVER_ERROR,
        status: 500
    };
    if (e && e.errors && Array.isArray(e.errors) && e.errors.length) {
        if (e.errors[0].message) {
            error.message = e.errors[0].message;
            if (e.errors[0].message.search(messages.UNIQUE_CONSTRAINT) > -1) {
                error.status = 409;
            }
        }
    }
    return error;
};

/**
 * Error hanlder for services
 * @param {Object} error error object returned by database helper functions (database layer)
 * @param {Object} responseObj service layer response object
 */
module.exports.serviceErrorHanlder = (error, responseObj) => {
    if(error && error.status && error.message) {
        responseObj.status = error.status;
        responseObj.message = error.message;
    }
};