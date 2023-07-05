'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageSliderArticles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Articles }) {
      // define association here
      this.belongsTo(Articles, { foreignKey: 'idBlock' });
    }
  }
  ImageSliderArticles.init({
    image: DataTypes.TEXT,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImageSliderArticles',
  });
  return ImageSliderArticles;
};