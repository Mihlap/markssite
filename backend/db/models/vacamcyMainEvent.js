'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VacancyMainEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VacancyMainEvent.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      files: DataTypes.STRING,
      eventData: DataTypes.JSON,
      hidden: DataTypes.BOOLEAN,
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'VacancyMainEvent',
    },
  );
  return Event;
};
