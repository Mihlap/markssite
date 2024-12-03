'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Journals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      publication_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      issue_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      authors: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      organizations: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      locations: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      statusObject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      markdown_content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Journals');
  },
};
