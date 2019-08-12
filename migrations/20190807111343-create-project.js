'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Projects', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
        allowNull: false
      },
      user_id: {   //FK
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      api_gateway_uri: {
        type: Sequelize.STRING
      },
      lambda_uri: {
        type: Sequelize.STRING
      },
      vpc_name: { 
        type: Sequelize.STRING,
      },	
      aws_region: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        default: Sequelize.NOW,
        required: true,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        default: Sequelize.NOW,
        required: true,
        allowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Projects');
  }
};