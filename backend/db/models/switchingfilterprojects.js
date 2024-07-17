'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SwitchingFilterProjects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SwitchingFilterProjects.init({
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SwitchingFilterProjects',
  });
  return SwitchingFilterProjects;
};