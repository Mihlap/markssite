'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageToDescription extends Model {
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
  imageToDescription.init({
    image: DataTypes.TEXT,
    text: DataTypes.STRING,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'imageToDescription',
  });
  return imageToDescription;
};