'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class quoteBlock extends Model {
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
  quoteBlock.init({
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    idBlock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'quoteBlock',
  });
  return quoteBlock;
};