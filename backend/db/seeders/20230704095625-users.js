'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = '123';
    const hashpassWord = await bcrypt.hash(password, 10);
    const password2 = 'Lbcrb200'
    const hashpassWord2 = await bcrypt.hash(password2, 10);
    const password3 = 'cat';
    const hashpassWord3 = await bcrypt.hash(password3, 10);

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
          hashpass: hashpassWord2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: 'kitty',
          hashpass: hashpassWord3,
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
