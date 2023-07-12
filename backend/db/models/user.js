'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Project, Articles, Staff }) {
      // define association here
      this.hasMany(Project, { foreignKey: 'authorId' });
      this.hasMany(Articles, { foreignKey: 'authorId' });
      this.hasMany(Staff, { foreignKey: 'userId' });
    }
  }
  User.init({
    userName: DataTypes.STRING,
    hashpass: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};