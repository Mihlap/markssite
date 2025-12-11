'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Legend extends Model {
    static associate({ ConstructorLegend, User }) {
      this.hasMany(ConstructorLegend, { foreignKey: 'legendId' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'author' });
    }
  }

  Legend.init(
    {
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: DataTypes.TEXT,
      description: DataTypes.TEXT,
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Legend',
    },
  );

  return Legend;
};
