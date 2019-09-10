

let postgresDb = require('../models/index');
const { databaseErrorHandler } = require('../utils/errorHandler');

module.exports.createRecord = async (tableName, data) => {
    try {
        const record = await postgresDb[tableName].create(data);
        return record.dataValues;
    } catch (e) {
        throw databaseErrorHandler(e);
    }
}


module.exports.findRecords = async (tableName, query) => {
    try {
        let limit;
        let offset;
        if (query && query.limit && query.offset) {
            limit = parseInt(query.limit);
            offset = parseInt(query.offset);
            offset = (limit * (offset - 1));
            delete query.limit;
            delete query.offset;
        }
        let records = await postgresDb[tableName].findAll({
            where: query,
            limit,
            offset
        });

        let dataList = [];

        if (records.length) {
            records.map((record) => {
                dataList.push(record.dataValues);
            });

            return dataList;
        } else {
            return records;
        }
    } catch (e) {
        throw new Error(e);
    }
}
// Generic function to fetch records order by need to pass [["column_name","order(either ascending or descending)"]]
module.exports.findRecordsWithOrderBy = async (tableName, query, order = []) => {
    try {
        let records = await postgresDb[tableName].findAll({
            where: query,
            order: order
        });

        let dataList = [];

        if (records.length) {
            records.map((record) => { // eslint-disable-line
                dataList.push(record.dataValues);
            });

            return dataList;
        } else {
            return records;
        }
    } catch (e) {
        throw new Error(e);
    }
}


module.exports.updateRecord = async (tableName, data, query) => {
    try {
        let updatedRecord = await postgresDb[tableName].update(data, {
            where: query
        });

        return updatedRecord;
    } catch (e) {
        throw new Error(e);
    }
}

module.exports.deleteRecord = async (tableName, query) => {
    try {
        let deletedRecord = await postgresDb[tableName].destroy({
            where: query
        });

        return deletedRecord;
    } catch (e) {
        throw new Error(e);
    }
}
