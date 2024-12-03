'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AttachmentsJournal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Journal }) {   
      this.belongsTo(Journal, {
        foreignKey: 'journal_id',
        as: 'journal',
      });
    }
  }

  AttachmentsJournal.init({
    journal_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Journal',
        key: 'id',
      },
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'AttachmentsJournal',
    timestamps: true,
  });

  return AttachmentsJournal;
};
