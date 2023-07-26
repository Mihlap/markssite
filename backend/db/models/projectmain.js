'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectMain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectMain.init({
    project: DataTypes.JSON,
    IdProject: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'ProjectMain',
  });
  return ProjectMain;
};