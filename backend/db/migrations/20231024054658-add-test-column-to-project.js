'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'test', {
      type: Sequelize.STRING,
      allowNull: true, // установите false, если колонка не должна быть NULL
      defaultValue: null, // установите значение по умолчанию, если требуется
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.removeColumn('Projects', 'test');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
