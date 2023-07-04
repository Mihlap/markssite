'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User, { foreignKey: 'staffId' });
    }
  }
  Staff.init(
    {
      name: DataTypes.STRING,
      img: DataTypes.TEXT,
      categorie: DataTypes.STRING,
      position: DataTypes.STRING,
      description: DataTypes.TEXT,
      about: DataTypes.TEXT,
      about1: DataTypes.TEXT,
      about2: DataTypes.TEXT,
      about3: DataTypes.TEXT,
      about4: DataTypes.TEXT,
      about5: DataTypes.TEXT,
      staffId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Staff',
    },
  );
  return Staff;
};
