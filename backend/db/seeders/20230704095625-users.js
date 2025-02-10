'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password1 = process.env.USER1_PASSWORD;
    const password2 = process.env.USER2_PASSWORD;
    const password3 = process.env.USER3_PASSWORD;
    const password4 = process.env.USER4_PASSWORD;

    const hashpassWord = await bcrypt.hash(password1, 10);
    const hashpassWord2 = await bcrypt.hash(password2, 10);
    const hashpassWord3 = await bcrypt.hash(password3, 10);
    const hashpassWord4 = await bcrypt.hash(password4, 10);

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
          userName: 'manager',
          hashpass: hashpassWord3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: 'hr778',
          hashpass: hashpassWord4,
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
