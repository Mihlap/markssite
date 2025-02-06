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
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      issue_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      authors: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      organizations: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      locations: {
        type: Sequelize.JSON,
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
      editorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      imageKey: {
        type: Sequelize.STRING,
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
