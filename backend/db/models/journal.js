'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, {
        foreignKey: 'editorId',
      });
    }
  }

  Journal.init(
    {
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      publication_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      issue_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      authors: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      organizations: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      locations: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      statusObject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      markdown_content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      editorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      imageKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Journal',
      timestamps: true,
    },
  );
  return Journal;
};
