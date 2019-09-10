'use strict';
/**
 * packages
 */
const crypto = require('crypto');
/**
 * Utils
 */
const { encrypt, decrypt } = require('../utils/cryptography');

module.exports = (sequelize, DataTypes) => {
    var Database = sequelize.define('Database', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            required: true,
            allowNull: false
        },
        host: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        schema_name: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        pass: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        port: {
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        },
        project_id: {   //FK
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
            required: true,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            required: true,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            required: true,
            allowNull: false
        }
    },
        {
            timestamps: false
        }
    );

    Database.associate = function (models) {
        Database.belongsTo(models.Project, {
            foreignKey: 'project_id',
            as: "Project"
        });
        Database.hasMany(models.Table, {
            foreignKey: 'database_id',
            as: "Table"
        })
    };
    // Database.sync({});

    Database.beforeSave(function (model) {
        if (model.pass && model.pass.length >= 6) {
            /**
             * encrypt database password
             */
            model.pass = encrypt(model.pass);
        }
    });

    Database.afterFind(function (data) {
        if (data && Array.isArray(data) && data.length) {
            data.forEach((element) => {
                if(element.pass) {
                    /**
                     * decrypt database password
                     */
                    element.pass = decrypt(element.pass);
                }
            });
        }
    });

    return Database;
};
