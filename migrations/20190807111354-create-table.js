
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tables', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        required: true
      },
      schema: {
        type: Sequelize.JSONB,
        required: true,
        allowNull: false
      },
      api_gateway_uri: {
        type: Sequelize.STRING
      },
      lambda_uri: {
        type: Sequelize.STRING
      },
      database_id: { //FK
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Databases',
          key: 'id'
        }
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
    return queryInterface.dropTable('Tables');
  }
};