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
    static associate({
      User,
      blockHeadingTitle,
      textBlockArticles,
      frameBlock,
      imageToDescriptionArticles,
      quoteBlocks,
      notesBlock,
      imageTwoArticles,
      imageSliderArticles,
      videoArticles,
    }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'authorId' });
      this.hasMany(blockHeadingTitle, { foreignKey: 'idBlock' });
      this.hasMany(textBlockArticles, { foreignKey: 'idBlock' });
      this.hasMany(frameBlock, { foreignKey: 'idBlock' });
      this.hasMany(imageToDescriptionArticles, { foreignKey: 'idBlock' });
      this.hasMany(quoteBlocks, { foreignKey: 'idBlock' });
      this.hasMany(notesBlock, { foreignKey: 'idBlock' });
      this.hasMany(imageTwoArticles, { foreignKey: 'idBlock' });
      this.hasMany(imageSliderArticles, { foreignKey: 'idBlock' });
      this.hasMany(videoArticles, { foreignKey: 'idBlock' });
    }
  }
  Articles.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    city: DataTypes.STRING,
    dataMonthYear: DataTypes.STRING,
    imageTitle: DataTypes.TEXT,
    titleTextBlock: DataTypes.STRING,
    descriptionArticle: DataTypes.STRING,
    imageAuthor: DataTypes.TEXT,
    imageOpen: DataTypes.STRING,
    textBlock: DataTypes.TEXT,
    imageClose: DataTypes.STRING,
    authorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Articles',
  });
  return Articles;
};