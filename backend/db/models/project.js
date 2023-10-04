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
      Constructor,
    }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'authorId' });
      this.hasMany(Constructor, { foreignKey: 'idBlock' });
    }
  }
  Project.init({
    title: DataTypes.STRING,
    selectCompetencies: DataTypes.STRING,
    countryCity: DataTypes.STRING,
    monthYear: DataTypes.STRING,
    viewConstruction: DataTypes.STRING,
    imageTitle: DataTypes.TEXT,
    imageProject: DataTypes.TEXT,
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
    publicationTwo: DataTypes.STRING,
    linkToPublicationTwo: DataTypes.STRING,
    awards: DataTypes.STRING,
    imageOpen: DataTypes.STRING,
    headingTextBlock: DataTypes.STRING,
    textBlock: DataTypes.TEXT,
    imageClose: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    style: DataTypes.STRING,
    geoData: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};