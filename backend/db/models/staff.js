'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  Staff.init(
    {
      name: DataTypes.STRING,
      img: DataTypes.TEXT,
      category: DataTypes.STRING,
      position: DataTypes.STRING,
      description: DataTypes.TEXT,
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
      description1: DataTypes.TEXT,
      about24: DataTypes.TEXT,
      description2: DataTypes.TEXT,
      about25: DataTypes.TEXT,
      about26: DataTypes.TEXT,
      about27: DataTypes.TEXT,
      about28: DataTypes.TEXT,
      about29: DataTypes.TEXT,
      about30: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Staff',
    },
  );
  return Staff;
};
