'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Constructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Project }) {
      // define association here
    this.belongsTo(Project, { foreignKey: 'idBlock' });
    }
  }
  Constructor.init({
    data: DataTypes.JSON,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Constructor',
  });
  return Constructor;
};