'use strict';
module.exports = (sequelize, DataTypes) => {
	var Project = sequelize.define('Project', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			required: true,
			allowNull: false
		},
		user_id: {
			type: DataTypes.STRING,
			required: true,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			required: true,
			allowNull: false
		},
		vpc_name: {
			type: DataTypes.STRING,
		},
		aws_region: {
			type: DataTypes.STRING,
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

	Project.associate = function (models) {
		Project.hasMany(models.Database, {
			foreignKey: 'project_id',
			as: "Database"
		});
	};
	// Project.sync({});

	return Project;
};