'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VacancyMainEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      files: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eventData: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
      },
      hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      order: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VacancyMainEvents');
  }
};
