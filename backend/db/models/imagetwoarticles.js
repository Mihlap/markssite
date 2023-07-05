'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageTwoArticles extends Model {
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
  ImageTwoArticles.init({
    imageOne: DataTypes.TEXT,
    imageTwo: DataTypes.TEXT,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImageTwoArticles',
  });
  return ImageTwoArticles;
};