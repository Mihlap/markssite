'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VacancyMainSlideCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VacancyMainSlideCard.init(
    {
      photoAva: DataTypes.STRING,
      cardData: DataTypes.JSON,
      hidden: DataTypes.BOOLEAN,
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'VacancyMainSlideCard',
    },
  );
  return VacancyMainSlideCard;
};