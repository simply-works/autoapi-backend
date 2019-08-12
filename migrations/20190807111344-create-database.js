'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Databases', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
        allowNull: false
      },
      host: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      user: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      pass: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      port: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false
      },
      project_id: {   // FK
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Projects',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('active','inactive'),
        defaultValue: 'active',
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
    return queryInterface.dropTable('Databases');
  }
};