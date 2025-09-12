'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SwitchingStaffCategories', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      leadership: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      science: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      hr: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.sequelize.query(`
      INSERT INTO "SwitchingStaffCategories" ("leadership","science","hr","createdAt","updatedAt")
      VALUES (false,false,false, NOW(), NOW())
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('SwitchingStaffCategories');
  },
};
