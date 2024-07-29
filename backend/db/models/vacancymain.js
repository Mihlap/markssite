'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VacanciesMain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VacanciesMain.init(
    {
      vacancy: DataTypes.JSON,
      IdVacancy: DataTypes.SMALLINT,
      order: DataTypes.INTEGER,
      field1: DataTypes.TEXT,
      field2: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'ProjectMain',
    },
  );
  return VacanciesMain;
};