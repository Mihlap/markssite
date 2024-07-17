'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Articles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, ConstructorArticles }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'authorId' });
      this.hasMany(ConstructorArticles, { foreignKey: 'idBlock' });
    }
  }
  Articles.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      city: DataTypes.STRING,
      dataMonthYear: DataTypes.STRING,
      selectCompetencies: DataTypes.STRING,
      imageTitle: DataTypes.TEXT,
      titleTextBlock: DataTypes.STRING,
      descriptionArticle: DataTypes.TEXT,
      imageAuthor: DataTypes.TEXT,
      imageOpen: DataTypes.TEXT,
      textBlock: DataTypes.TEXT,
      imageClose: DataTypes.TEXT,
      authorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Articles',
    },
  );
  return Articles;
};