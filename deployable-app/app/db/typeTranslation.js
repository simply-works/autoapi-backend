
const Sequelize = require('sequelize');

module.exports = {
    String : Sequelize.STRING,
    Number: Sequelize.INTEGER,
    Boolean: Sequelize.BOOLEAN,
    Float: Sequelize.FLOAT,
    Date: Sequelize.DATE
}