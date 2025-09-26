'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SwitchingStaffCategories extends Model {
    static associate() {}
  }
  SwitchingStaffCategories.init(
    {
      leadership: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      science: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      hr: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { sequelize, modelName: 'SwitchingStaffCategories' },
  );
  return SwitchingStaffCategories;
};
