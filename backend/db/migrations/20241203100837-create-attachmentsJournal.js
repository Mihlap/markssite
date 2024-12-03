'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attachmentsJournals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      journal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Journals',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
        author_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      file_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_name: {
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
    await queryInterface.dropTable('attachmentsJournals');
  },
};
