'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = '123';
    const hashpassWord = await bcrypt.hash(password, 10);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          userName: 'Pokemon',
          hashpass: hashpassWord,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: 'obezyankaa',
          hashpass: hashpassWord,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
