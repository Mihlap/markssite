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
      category: {
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
      about6: {
        type: Sequelize.TEXT,
      },
      about7: {
        type: Sequelize.TEXT,
      },
      about8: {
        type: Sequelize.TEXT,
      },
      about9: {
        type: Sequelize.TEXT,
      },
      about10: {
        type: Sequelize.TEXT,
      },
      about11: {
        type: Sequelize.TEXT,
      },
      about12: {
        type: Sequelize.TEXT,
      },
      about13: {
        type: Sequelize.TEXT,
      },
      about14: {
        type: Sequelize.TEXT,
      },
      about15: {
        type: Sequelize.TEXT,
      },
      about16: {
        type: Sequelize.TEXT,
      },
      about17: {
        type: Sequelize.TEXT,
      },
      about18: {
        type: Sequelize.TEXT,
      },
      description1: {
        type: Sequelize.TEXT,
      },
      about19: {
        type: Sequelize.TEXT,
      },
      description2: {
        type: Sequelize.TEXT,
      },
      about20: {
        type: Sequelize.TEXT,
      },
      about21: {
        type: Sequelize.TEXT,
      },
      about22: {
        type: Sequelize.TEXT,
      },
      about23: {
        type: Sequelize.TEXT,
      },
      about24: {
        type: Sequelize.TEXT,
      },
      about25: {
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
