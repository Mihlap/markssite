'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FrameBlock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Articles }) {
      // define association here
      this.belongsTo(Articles, { foreignKey: 'idBlock' });
    }
  }
  FrameBlock.init({
    text: DataTypes.TEXT,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FrameBlock',
  });
  return FrameBlock;
};