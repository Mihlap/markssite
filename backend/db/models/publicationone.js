'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationOne extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PublicationOne.init(
    {
      publication: DataTypes.JSON,
      IdArticle: DataTypes.SMALLINT,
    },
    {
      sequelize,
      modelName: 'PublicationOne',
    },
  );
  return PublicationOne;
};