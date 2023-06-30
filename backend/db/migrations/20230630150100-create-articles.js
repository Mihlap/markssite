'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      author: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      dataMonthYear: {
        type: Sequelize.STRING,
      },
      imageTitle: {
        type: Sequelize.TEXT,
      },
      titleTextBlock: {
        type: Sequelize.STRING,
      },
      descriptionArticle: {
        type: Sequelize.STRING,
      },
      imageAuthor: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Articles');
  }
};