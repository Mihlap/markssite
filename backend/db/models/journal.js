'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Journal extends Model {
        /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AttachmentsJournal, User }) {
      this.hasMany(AttachmentsJournal, {
        foreignKey: 'journal_id',
        as: 'attachments',
        onDelete: 'CASCADE', 
      }); 
       this.belongsTo(User, {
        foreignKey: 'editor_id',
        as: 'editor',
      });
    }
   }

  Journal.init({
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publication_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issue_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    authors: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    organizations: {
      type: DataTypes.JSONB, 
      allowNull: true,
    },
    locations: {
      type: DataTypes.JSONB,
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
     editor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      },
  }, {
    sequelize,
    modelName: 'Journal',  
    timestamps: true, 
  });
  return Journal;
}
