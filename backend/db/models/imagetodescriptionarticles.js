'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageToDescriptionArticles extends Model {
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
  imageToDescriptionArticles.init({
    image: DataTypes.TEXT,
    text: DataTypes.STRING,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'imageToDescriptionArticles',
  });
  return imageToDescriptionArticles;
};