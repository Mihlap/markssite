'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
      },
      direction: {
        type: Sequelize.STRING,
      },    
      experience: {
        type: Sequelize.STRING,
      },
      locationStaff: {
        type: Sequelize.STRING,
      },
      busyness: {
        type: Sequelize.STRING,
      },
      modeOperating: {
        type: Sequelize.STRING,
      },     
      skills: {
        type: Sequelize.STRING,
      },
      advantages: {
        type: Sequelize.STRING,
      },
      searchStaff: {
        type: Sequelize.TEXT,
      },
       haveToWork: {
        type: Sequelize.TEXT,
      },
       requirements: {
        type: Sequelize.TEXT,
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
      geoData: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Employees');
  }
};

