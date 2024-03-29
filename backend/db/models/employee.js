'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.belongsTo(models.User, { foreignKey: 'authorId' });   
    }
  }
  Employee.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: DataTypes.STRING,
    direction: DataTypes.STRING,
    experience: DataTypes.STRING,
    locationStaff: DataTypes.STRING,
    busyness: DataTypes.STRING,
    modeOperating: DataTypes.STRING,
    skills: DataTypes.TEXT,
    advantages: DataTypes.TEXT,
    searchStaff: DataTypes.TEXT,
    haveToWork: DataTypes.TEXT,
    requirements: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    style: DataTypes.STRING,
    type: DataTypes.STRING,
    geoData: DataTypes.TEXT,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Employee',
  });

  return Employee;
};