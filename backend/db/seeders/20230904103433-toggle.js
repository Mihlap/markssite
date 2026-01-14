'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'SwitchingFilterProjects',
      [
        {
          state: 'false',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
 
    await queryInterface.bulkInsert(
      'SwitchingFilterArticles',
      [
        {
          state: 'false',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SwitchingFilterProjects', null, {});
    await queryInterface.bulkDelete('SwitchingFilterArticles', null, {});
  },
};
