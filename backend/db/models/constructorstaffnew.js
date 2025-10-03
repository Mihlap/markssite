// 'use strict';
// const { Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class ConstructorStaffNew extends Model {
//     static associate({ StaffNew }) {
//       this.belongsTo(StaffNew, { foreignKey: 'staffNewId' });
//     }
//   }

//   ConstructorStaffNew.init(
//     {
//       data: DataTypes.JSON,
//       image: DataTypes.TEXT,
//       staffNewId: { type: DataTypes.INTEGER, allowNull: false },
//     },
//     {
//       sequelize,
//       modelName: 'ConstructorStaffNew',
//       timestamps: true,
//     },
//   );

//   return ConstructorStaffNew;
// };

module.exports = () => {
  return { name: 'SkippedModel' };
};