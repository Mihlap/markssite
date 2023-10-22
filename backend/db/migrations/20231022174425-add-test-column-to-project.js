'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'test', {
      type: Sequelize.STRING,
      allowNull: true, // установите false, если колонка не должна быть NULL
      defaultValue: null, // установите значение по умолчанию, если требуется
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Projects', 'test');
  },
};
