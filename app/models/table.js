'use strict';
module.exports = (sequelize, DataTypes) => {
    var Table = sequelize.define('Table', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            required: true,
            allowNull: false
        },
        schema: {
            type: DataTypes.JSONB,
            required: true,
            allowNull: false
        },
        database_id: { //FK
            type: DataTypes.INTEGER,
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

    Table.associate = function (models) {
        Table.belongsTo(models.Database, {
            foreignKey: 'database_id',
            as: "Database"
        });
    };
    // Table.sync({});

    return Table;
};