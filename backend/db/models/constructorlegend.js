'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConstructorLegend extends Model {
    static associate({ Legend }) {
      this.belongsTo(Legend, { foreignKey: 'legendId' });
    }
  }

  ConstructorLegend.init(
    {
      data: DataTypes.JSON,
      image: DataTypes.TEXT,
      legendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ConstructorLegend',     
    },
  );

  return ConstructorLegend;
};
