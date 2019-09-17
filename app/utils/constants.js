'use strict'
exports.constants = {
    defaultServerResponse: {
        status: 500,
        message: 'Something went wrong',
        body: {}
    },
    SERVER_ERROR: "Internal server error",
    DEFAULT_ERROR: "Something went wrong",
    FETCHED_RECORD: "Fetched records",
    messages: {
        UNIQUE_CONSTRAINT: 'must be unique',
        UNIQUE_CONSTRAINT_SUCCESS: 'is unique',
        PROJECT_NOT_FOUND: 'Project not found',
        BAD_REQUEST: 'Bad request',
        DATABASE_NOT_FOUND: 'Database not found',
        TABLE_CREATE_IN_PROGRESS: 'Table creation in progress'
    }
};
