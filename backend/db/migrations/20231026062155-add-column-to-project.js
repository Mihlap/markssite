'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'numberOfLanes', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Projects', 'long', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    // ... добавьте больше колонок по мере необходимости
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Projects', 'numberOfLanes');
    await queryInterface.removeColumn('Projects', 'long');
    // ... уберите больше колонок по мере необходимости
  },
};
