'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class videoArticles extends Model {
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
  videoArticles.init({
    video: DataTypes.BLOB,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'videoArticles',
  });
  return videoArticles;
};