'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListUserAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ListUserAuth.init({
    userName: DataTypes.STRING,
    hashpass: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ListUserAuth',
  });
  return ListUserAuth;
};