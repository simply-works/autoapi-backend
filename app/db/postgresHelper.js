

var postgresDb = require('../models/index');
var constants = require('../utils/constants').constants;

module.exports.createRecord = async (tableName, data) => {
    try {
        let record = await postgresDb[tableName].create(data);

        return record.dataValues;
    } catch (e) {
        throw new Error({error:constants.SERVER_ERROR,code: 500});
    }
}


module.exports.findRecords = async (tableName, query) => {
    try {
        let records = await postgresDb[tableName].findAll({
            where: query
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
module.exports.findRecordsWithOrderBy = async (tableName, query, order=[]) => {
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
