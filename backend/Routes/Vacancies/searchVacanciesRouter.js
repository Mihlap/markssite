// const { VacanciesMain } = require('../../db/models');

// async function searchVacanciesRouter(fastify, options) {

//   // Сохранение или обновление вакансии
//   fastify.post('/search-vacancy', async (request, reply) => {
//     const { vacancy, IdVacancy } = request.body;
//     try {
//       const existingEntry = await VacanciesMain.findOne({ where: { IdVacancy } });
//       if (existingEntry) {
//         await existingEntry.update({ vacancy });
//       } else {
//         await VacanciesMain.create({ vacancy, IdVacancy });
//       }
//       return reply.code(200).send({ message: 'Вакансия сохранена/обновлена успешно.' });
//     } catch (error) {
//       console.error('Ошибка при сохранении вакансии:', error);
//       return reply.code(500).send({ error: 'Ошибка при обработке вашего запроса' });
//     }
//   });

//   // Получение всех записей вакансий
//   fastify.get('/search-vacancy/getzapros', async (request, reply) => {
//     try {
//       const data = await VacanciesMain.findAll();
//       return reply.send(data);
//     } catch (error) {
//       console.error('Ошибка при получении данных:', error);
//       return reply.code(500).send({ error: 'Ошибка при получении данных' });
//     }
//   });

//   // Удаление записи вакансии по IdVacancy
//   fastify.delete('/search-vacancy/deletezapros/:IdVacancy', async (request, reply) => {
//     try {
//       const { IdVacancy } = request.params;
//       await VacanciesMain.destroy({ where: { IdVacancy } });
//       return reply.code(200).send();
//     } catch (error) {
//       console.error('Ошибка при удалении записи:', error);
//       return reply.code(500).send();
//     }
//   });

//   // Обновление порядка вакансий
//   fastify.put('/search-vacancy-replacement', async (request, reply) => {
//     try {
//       const updatedVacancies = request.body;
//       /* eslint-disable no-await-in-loop */
//       for (let i = 0; i < updatedVacancies.length; i+=1) {
//         await VacanciesMain.update({ order: i }, { where: { id: updatedVacancies[i].id } });
//       }
//       /* eslint-enable no-await-in-loop */

//       const data = await VacanciesMain.findAll();
//       return reply.send(data);
//     } catch (error) {
//       console.error('Ошибка при обновлении порядка:', error);
//       return reply.code(500).send();
//     }
//   });
// };

// module.exports = searchVacanciesRouter;

const express = require('express');
const { VacanciesMain } = require('../../db/models');

const router = express.Router();

router.post('/search-vacancy', async (req, res) => {
  const { vacancy, IdVacancy } = req.body;
  try {
    const existingEntry = await VacanciesMain.findOne({ where: { IdVacancy } });
    if (existingEntry) {  
      await existingEntry.update({ vacancy });
    } else {     
      await VacanciesMain.create({ vacancy, IdVacancy });
    }
    res.status(200).json({ message: 'Вакансия сохранена/обновлена успешно.' });
  } catch (error) {
    console.error('Ошибка при сохранении вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса' });
  }
});

router.get('/search-vacancy/getzapros', async (req, res) => {
  try {
    const data = await VacanciesMain.findAll();

    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/search-vacancy/deletezapros/:IdVacancy', async (req, res) => {
  try {
    const { IdVacancy } = req.params;
    await VacanciesMain.destroy({ where: { IdVacancy } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/search-vacancy-replacement', async (req, res) => {
  try {
    const updatedVacancies = req.body;

     for (let i = 0; i < updatedVacancies.length; i+=1) {
      // eslint-disable-next-line no-await-in-loop
      await VacanciesMain.update({ order: i },
        { where: { id: updatedVacancies[i].id } }
      );
    }

    const data = await VacanciesMain.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
