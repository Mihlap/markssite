'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaffNew extends Model {
    static associate({ ConstructorStaffNew, User }) {     
      this.hasMany(ConstructorStaffNew, { foreignKey: 'staffNewId' });  
      this.belongsTo(User, { foreignKey: 'userId', as: 'author' });
    }
  }

  StaffNew.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: false },
      img: DataTypes.TEXT,
      description: DataTypes.TEXT,
      category: {
        type: DataTypes.JSONB,
        allowNull: true,
        get() {
          const v = this.getDataValue('category');
          if (!v) return [];
          return Array.isArray(v) ? v : [v];
        },
        set(val) {
          this.setDataValue('category', Array.isArray(val) ? val : val ? [val] : []);
        },
      },
      visibilityByCategory: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        get() {
          const v = this.getDataValue('visibilityByCategory');
          return v && typeof v === 'object' ? v : {};
        },
        set(val) {
          this.setDataValue('visibilityByCategory', val && typeof val === 'object' ? val : {});
        },
      },
      position: DataTypes.STRING,
      isVisible: { type: DataTypes.BOOLEAN, defaultValue: true },
      sortIndex: { type: DataTypes.INTEGER, defaultValue: 0 },

      // — старые поля для обратной совместимости —
      about: DataTypes.TEXT,
      about1: DataTypes.TEXT,
      about2: DataTypes.TEXT,
      about3: DataTypes.TEXT,
      about4: DataTypes.TEXT,
      about5: DataTypes.TEXT,
      about6: DataTypes.TEXT,
      about7: DataTypes.TEXT,
      about8: DataTypes.TEXT,
      about9: DataTypes.TEXT,
      about10: DataTypes.TEXT,
      about11: DataTypes.TEXT,
      about12: DataTypes.TEXT,
      about13: DataTypes.TEXT,
      about14: DataTypes.TEXT,
      about15: DataTypes.TEXT,
      about16: DataTypes.TEXT,
      about17: DataTypes.TEXT,
      about18: DataTypes.TEXT,
      about19: DataTypes.TEXT,
      about20: DataTypes.TEXT,
      about21: DataTypes.TEXT,
      about22: DataTypes.TEXT,
      about23: DataTypes.TEXT,
      about24: DataTypes.TEXT,
      about25: DataTypes.TEXT,
      about26: DataTypes.TEXT,
      about27: DataTypes.TEXT,
      about28: DataTypes.TEXT,
      about29: DataTypes.TEXT,
      about30: DataTypes.TEXT,
      description1: DataTypes.TEXT,
      description2: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'StaffNew',
      timestamps: true,
      indexes: [
        { fields: ['sortIndex'] },
        { fields: ['isVisible'] },
        { using: 'GIN', fields: ['category'] },
        { fields: ['sortIndex', 'createdAt'] },
      ],
    },
  );

  return StaffNew;
};
