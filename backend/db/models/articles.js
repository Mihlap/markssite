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
      BlockHeadingTitle,
      TextBlockArticles,
      FrameBlock,
      ImageToDescriptionArticles,
      QuoteBlock,
      NotesBlock,
      ImageTwoArticles,
      ImageSliderArticles,
      VideoArticles,
    }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'authorId' });
      this.hasMany(BlockHeadingTitle, { foreignKey: 'idBlock' });
      this.hasMany(TextBlockArticles, { foreignKey: 'idBlock' });
      this.hasMany(FrameBlock, { foreignKey: 'idBlock' });
      this.hasMany(ImageToDescriptionArticles, { foreignKey: 'idBlock' });
      this.hasMany(QuoteBlock, { foreignKey: 'idBlock' });
      this.hasMany(NotesBlock, { foreignKey: 'idBlock' });
      this.hasMany(ImageTwoArticles, { foreignKey: 'idBlock' });
      this.hasMany(ImageSliderArticles, { foreignKey: 'idBlock' });
      this.hasMany(VideoArticles, { foreignKey: 'idBlock' });
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