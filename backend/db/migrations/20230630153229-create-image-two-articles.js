'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ImageTwoArticles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      imageOne: {
        type: Sequelize.TEXT,
      },
      imageTwo: {
        type: Sequelize.TEXT,
      },
      idBlock: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Articles',
          key: 'id',
        },
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
    await queryInterface.dropTable('ImageTwoArticles');
  }
};