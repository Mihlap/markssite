'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Сидирование для SwitchingFilterProjects
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

    // Сидирование для SwitchingFilterArticle
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
