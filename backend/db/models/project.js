'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      User,
      ImageToDescription,
      TextBlock,
      ImageBlockThree,
      ImageBlockTwo,
      ImageSlider,
      Video,
    }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'authorId' });
      this.hasMany(ImageToDescription, { foreignKey: 'idBlock' });
      this.hasMany(TextBlock, { foreignKey: 'idBlock' });
      this.hasMany(ImageBlockThree, { foreignKey: 'idBlock' });
      this.hasMany(ImageBlockTwo, { foreignKey: 'idBlock' });
      this.hasMany(ImageSlider, { foreignKey: 'idBlock' });
      this.hasMany(Video, { foreignKey: 'idBlock' });
    }
  }
  Project.init({
    title: DataTypes.STRING,
    selectCompetencies: DataTypes.STRING,
    countryCity: DataTypes.STRING,
    monthYear: DataTypes.STRING,
    viewConstruction: DataTypes.STRING,
    imageTitle: DataTypes.TEXT,
    titleTextBlock: DataTypes.STRING,
    descriptionProject: DataTypes.TEXT,
    totalArea: DataTypes.STRING,
    siteArea: DataTypes.STRING,
    floors: DataTypes.STRING,
    altitude: DataTypes.STRING,
    constructionVolume: DataTypes.STRING,
    location: DataTypes.STRING,
    degreeParticipation: DataTypes.STRING,
    statusObject: DataTypes.STRING,
    customer: DataTypes.STRING,
    publication: DataTypes.STRING,
    linkToPublication: DataTypes.STRING,
    awards: DataTypes.STRING,
    imageOpen: DataTypes.STRING,
    textBlock: DataTypes.TEXT,
    imageClose: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    style: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};