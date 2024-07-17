'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.bulkInsert(
    //   'Articles',
    //   [
    //     {
    //       title: 'Заголовок статьи 1',
    //       author: 'Автор статьи 1',
    //       city: 'Город 1',
    //       dataMonthYear: 'Дата/месяц/год 1',
    //       imageTitle: 'winepark.png',
    //       titleTextBlock: 'Заголовок текстового блока 1',
    //       descriptionArticle: 'Описание статьи 1',
    //       imageAuthor: 'Изображение автора 1',
    //       imageOpen: 'Изображение открытия 1',
    //       textBlock: 'Текстовый блок 1',
    //       imageClose: 'Изображение закрытия 1',
    //       authorId: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       title: 'Заголовок статьи 2',
    //       author: 'Автор статьи 2',
    //       city: 'Город 1',
    //       dataMonthYear: 'Дата/месяц/год 2',
    //       imageTitle: 'badayevsky.png',
    //       titleTextBlock: 'Заголовок текстового блока 2',
    //       descriptionArticle: 'Описание статьи 2',
    //       imageAuthor: 'Изображение автора 2',
    //       imageOpen: 'Изображение открытия 2',
    //       textBlock: 'Текстовый блок 2',
    //       imageClose: 'Изображение закрытия 2',
    //       authorId: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   {},
    // );
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('Articles', null, {});
  },
};
