'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SwitchingStaffCategories extends Model {
    static associate() {}
  }
  SwitchingStaffCategories.init(
    {
      leadership: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      science: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      hr: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { sequelize, modelName: 'SwitchingStaffCategories' },
  );
  return SwitchingStaffCategories;
};
