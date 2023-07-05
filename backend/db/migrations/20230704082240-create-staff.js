'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Staffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        },
      name: {
        type: Sequelize.STRING,
      },
      img: {
        type: Sequelize.TEXT,
      },
      categorie: {
        type: Sequelize.STRING,
      },
      position: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      about: {
        type: Sequelize.TEXT,
      },
      about1: {
        type: Sequelize.TEXT,
      },
      about2: {
        type: Sequelize.TEXT,
      },
      about3: {
        type: Sequelize.TEXT,
      },
      about4: {
        type: Sequelize.TEXT,
      },
      about5: {
        type: Sequelize.TEXT,
      },
      userId: {
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
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Staffs');
  },
};
