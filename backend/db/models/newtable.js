'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Project }) {
      // define association here
      this.belongsTo(Project, { foreignKey: 'projectId' });
    }
  }
  NewTable.init(
    {
      title: DataTypes.STRING,
      test: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'NewTable',
    },
  );
  return NewTable;
};
