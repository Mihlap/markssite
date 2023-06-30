'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      selectCompetencies: {
        type: Sequelize.STRING,
      },
      countryCity: {
        type: Sequelize.STRING,
      },
      monthYear: {
        type: Sequelize.STRING,
      },
      viewConstruction: {
        type: Sequelize.STRING,
      },
      imageTitle: {
        type: Sequelize.TEXT,
      },
      titleTextBlock: {
        type: Sequelize.STRING,
      },
      descriptionProject: {
        type: Sequelize.TEXT,
      },
      totalArea: {
        type: Sequelize.STRING,
      },
      siteArea: {
        type: Sequelize.STRING,
      },
      floors: {
        type: Sequelize.STRING,
      },
      altitude: {
        type: Sequelize.STRING,
      },
      constructionVolume: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      degreeParticipation: {
        type: Sequelize.STRING,
      },
      statusObject: {
        type: Sequelize.STRING,
      },
      customer: {
        type: Sequelize.STRING,
      },
      publication: {
        type: Sequelize.STRING,
      },
      linkToPublication: {
        type: Sequelize.STRING,
      },
      awards: {
        type: Sequelize.STRING,
      },
      imageOpen: {
        type: Sequelize.STRING,
      },
      textBlock: {
        type: Sequelize.TEXT,
      },
      imageClose: {
        type: Sequelize.STRING,
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
      },
      style: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};