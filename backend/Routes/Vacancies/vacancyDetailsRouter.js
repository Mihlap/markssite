// const { Op } = require('sequelize');
// const { VacancyMainSlideCard } = require('../../db/models');
// const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

// async function vacancyDetailsRouter(fastify, options) {
//   // Парсинг multipart через req.parts()
//   /* eslint-disable no-restricted-syntax, no-await-in-loop */
//   async function parseMultipart(parts) {
//     const files = {};
//     const fields = {};
//     for await (const part of parts) {
//       if (part.file) {
//         if (!files[part.fieldname]) files[part.fieldname] = [];
//         const buffer = await part.toBuffer();
//         files[part.fieldname].push({ ...part, buffer });
//       } else {
//         fields[part.fieldname] = part.value;
//       }
//     }
//     return { files, fields };
//   }
//   /* eslint-enable no-restricted-syntax, no-await-in-loop */

//   // Получение имени файла из URL
//   function getFileNameFromUrl(url) {
//     const parts = url.split('/');
//     return parts[parts.length - 1];
//   }

//   // Удаление изображения из S3, если больше нигде не используется
//   async function deleteImageIfUnused(imageUrl, currentId) {
//     try {
//       const other = await VacancyMainSlideCard.findOne({
//         where: { photoAva: imageUrl, id: { [Op.ne]: currentId } },
//       });
//       if (!other && imageUrl) {
//         const fileName = getFileNameFromUrl(imageUrl);
//         await deleteFileFromS3(fileName, 'images/slideCard');
//       }
//     } catch (err) {
//       console.error(`Ошибка при удалении изображения ${imageUrl}:`, err);
//     }
//   }

//   // Обновление одного слайда
//   fastify.put('/update-slide/:id', async (request, reply) => {
//     const { files, fields } = await parseMultipart(request.parts());
//     const { id } = request.params;
//     const slide = await VacancyMainSlideCard.findByPk(id);
//     if (!slide) {
//       return reply.code(404).send({ message: 'Слайд не найден' });
//     }
//     const oldImage = slide.photoAva;
//     let details;
//     try {
//       details = JSON.parse(fields.details || '{}');
//     } catch {
//       details = {};
//     }

//     if (fields.removePhotoAva === 'true' && slide.photoAva) {
//       await deleteImageIfUnused(slide.photoAva, id);
//       slide.photoAva = '';
//     }

//     if (files.photoAva) {
//       const fileUrl = await uploadFileToS3(files.photoAva[0], 'images/slideCard');
//       slide.photoAva = fileUrl;
//     }

//     await slide.update({ photoAva: slide.photoAva, cardData: details });

//     if (oldImage && oldImage !== slide.photoAva) {
//       await deleteImageIfUnused(oldImage, id);
//     }

//     reply.send({ message: 'Слайд успешно обновлен', data: slide });
//   });

//   // Обновление порядка слайдов
//   fastify.put('/update-slides-order', async (request, reply) => {
//     const { slides } = request.body;
//     if (!Array.isArray(slides)) {
//       return reply.code(400).send({ error: 'Некорректные данные: ожидался массив слайдов' });
//     }
//     /* eslint-disable no-await-in-loop */
//     for (let i = 0; i < slides.length; i+=1) {
//       const { id, order } = slides[i];
//       await VacancyMainSlideCard.update({ order }, { where: { id } });
//     }
//     /* eslint-enable no-await-in-loop */

//     const updatedSlides = await VacancyMainSlideCard.findAll({ order: [['order', 'ASC']] });
//     reply.send({ message: 'Порядок слайдов успешно обновлен', slides: updatedSlides });
//   });

//   // Создание нового слайда
//   fastify.post('/save-vacancy-details', async (request, reply) => {
//     const { files, fields } = await parseMultipart(request.parts());
//     let details;
//     try {
//       details = JSON.parse(fields.details);
//     } catch {
//       return reply.code(400).send({ error: 'Некорректные данные: не удалось распарсить JSON' });
//     }

//     if (!details.card1 || !details.card2 || !details.card3) {
//       return reply.code(400).send({ error: 'Некорректные данные: отсутствуют необходимые поля' });
//     }

//     let photoAva = '';
//     if (files.photoAva) {
//       photoAva = await uploadFileToS3(files.photoAva[0], 'images/slideCard');
//     }

//     const cardData = { card1: details.card1, card2: details.card2, card3: details.card3 };
//     const newSlide = await VacancyMainSlideCard.create({ cardData, hidden: false, photoAva });
//     reply.code(200).send({ message: 'Детали вакансии сохранены успешно.', data: newSlide });
//   });

//   // Получение всех слайдов
//   fastify.get('/get-slides', async (request, reply) => {
//     const data = await VacancyMainSlideCard.findAll({ order: [['order', 'ASC']] });
//     reply.send(data);
//   });

//   // Получение одного слайда
//   fastify.get('/get-slide/:id', async (request, reply) => {
//     const { id } = request.params;
//     const slide = await VacancyMainSlideCard.findByPk(id);
//     if (!slide) {
//       return reply.code(404).send({ message: 'Слайд не найден' });
//     }
//     reply.send(slide);
//   });

//   // Переключение видимости слайда
//   fastify.put('/toggle-slide/:id', async (request, reply) => {
//     const { id } = request.params;
//     const { hidden } = request.body;
//     const [count] = await VacancyMainSlideCard.update({ hidden }, { where: { id } });
//     if (count) {
//       reply.send({ message: 'Статус вакансии успешно обновлен', id, hidden });
//     } else {
//       reply.code(404).send({ error: 'Вакансия не найдена' });
//     }
//   });

//   // Удаление слайда
//   fastify.delete('/delete-slide/:id', async (request, reply) => {
//     const { id } = request.params;
//     if (!id || isNaN(parseInt(id, 10))) {
//       return reply.code(400).send({ error: 'Некорректный идентификатор слайда.' });
//     }

//     const slide = await VacancyMainSlideCard.findByPk(id);
//     if (!slide) {
//       return reply.code(404).send({ error: 'Слайд не найден.' });
//     }

//     await VacancyMainSlideCard.destroy({ where: { id } });
//     if (slide.photoAva) {
//       await deleteImageIfUnused(slide.photoAva, id);
//     }

//     reply.send({ message: 'Слайд удален', id });
//   });
// };

// module.exports = vacancyDetailsRouter;

/* eslint-disable no-await-in-loop */
const express = require('express');
const { Op } = require('sequelize');
const fileMiddleware = require('../../middleware/file');
const { VacancyMainSlideCard } = require('../../db/models');
const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

const router = express.Router();

function getFileNameFromUrl(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

const deleteImageIfUnused = async (imageName, currentSlideId) => {
  try {
     const otherSlidesWithImage = await VacancyMainSlideCard.findOne({
      where: { photoAva: imageName, id: { [Op.ne]: currentSlideId } },
    });

     if (!otherSlidesWithImage) {
      const fileName = getFileNameFromUrl(imageName);
      await deleteFileFromS3(fileName, 'images/slideCard');
    }
  } catch (error) {
    console.error(`Ошибка при удалении изображения ${imageName}:`, error);
  }
};

router.put('/update-slide/:id', fileMiddleware.fields([{ name: 'photoAva', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const details = JSON.parse(req.body.details);
      const slide = await VacancyMainSlideCard.findByPk(id);

      if (!slide) {
        return res.status(404).json({ message: "Слайд не найден" });
      }

      const oldImage = slide.photoAva;

       if (req.body.removePhotoAva === 'true' && slide.photoAva) {
        await deleteImageIfUnused(slide.photoAva, id);
        slide.photoAva = '';
      }

      if (req.files && req.files['photoAva']) {
        const fileUrl = await uploadFileToS3(req.files['photoAva'][0], 'images/slideCard');
        slide.photoAva = fileUrl;
      }

      await slide.update({
        photoAva: slide.photoAva,
        cardData: details,
      });

      if (oldImage && oldImage !== slide.photoAva) {
        await deleteImageIfUnused(oldImage, id);
      }

      res.json({ message: "Слайд успешно обновлен", data: slide });
    } catch (error) {
      console.error('Ошибка при обновлении слайда:', error);
      res.status(500).json({ error: "Ошибка сервера при обновлении слайда" });
    }
  }
);

router.put('/update-slides-order', async (req, res) => {
  const { slides } = req.body;

  if (!Array.isArray(slides)) {
    return res.status(400).json({ error: 'Некорректные данные: ожидался массив слайдов' });
  }

  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < slides.length; i++) {
      const { id, order } = slides[i];

      await VacancyMainSlideCard.update({ order }, { where: { id } });
    }

    const updatedSlides = await VacancyMainSlideCard.findAll({
      order: [['order', 'ASC']],
    });

    res.json({ message: 'Порядок слайдов успешно обновлен', slides: updatedSlides });
  } catch (error) {
    console.error('Ошибка при обновлении порядка слайдов:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновлении порядка слайдов' });
  }
});

router.post('/save-vacancy-details',
  fileMiddleware.fields([{
  name: 'photoAva',
  maxCount: 1
    },
  ]), async (req, res) => {
  let details;
  try {
    details = JSON.parse(req.body.details);
  } catch (error) {
    return res.status(400).json({ error: 'Некорректные данные: не удалось распарсить JSON' });
  }

  if (!details || !details.card1 || !details.card2 || !details.card3) {
    return res.status(400).json({ error: 'Некорректные данные: отсутствуют необходимые поля' });
  }

  let photoAva = '';
  // Если загружено фото
  if (req.files && req.files['photoAva']) {
    try {
      // Загружаем фото на S3 и получаем URL
      photoAva = await uploadFileToS3(req.files['photoAva'][0], 'images/slideCard');
    } catch (error) {
      console.error('Ошибка при загрузке фото на S3:', error);
      return res.status(500).json({ error: 'Ошибка при загрузке фото' });
    }
  }

  const cardData = {
    card1: details.card1,
    card2: details.card2,
    card3: details.card3,
  };

  try {
    const newSlide = await VacancyMainSlideCard.create({
      cardData,
      hidden: false,
      photoAva
    });

    res.status(200).json({ message: 'Детали вакансии сохранены успешно.', data: newSlide });
  } catch (error) {
    console.error('Ошибка при сохранении деталей вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса', details: error.errors });
  }
});

router.get('/get-slides', async (req, res) => {
  try {
    const data = await VacancyMainSlideCard.findAll({ order: [['order', 'ASC']] });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Произошла ошибка при получении данных.'
    });
  }
});

router.get('/get-slide/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const slide = await VacancyMainSlideCard.findByPk(id);
    if (!slide) {
      res.status(404).json({ message: "Слайд не найден" });
    } else {
      res.json(slide);
    }
  } catch (error) {
    console.error("Ошибка сервера при получении данных слайда:", error);
    res.status(500).json({ error: "Ошибка сервера при получении данных слайда" });
  }
});

router.put('/toggle-slide/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;

    const updated = await VacancyMainSlideCard.update({ hidden }, {
      where: { id }
    });

    if (updated) {
      res.json({ message: 'Статус вакансии успешно обновлен', id, hidden });
    } else {
      res.status(404).json({ error: 'Вканансии не найдено' });
    }
  } catch (error) {
    console.error('Ошибка обновления статуса вакансии:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса вакансии' });
  }
});

router.delete('/delete-slide/:id', async (req, res) => {
  const {id} = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Некорректный идентификатор слайда." });
  }

  try {
    const slide = await VacancyMainSlideCard.findByPk(id);

    if (!slide) {
      return res.status(404).json({ error: "Слайд не найден." });
    }

    const result = await VacancyMainSlideCard.destroy({ where: { id } });

    if (result > 0) {
       const otherSlidesWithImage = await VacancyMainSlideCard.findOne({
        where: { photoAva: slide.photoAva, id: { [Op.ne]: id } }
      });

      if (!otherSlidesWithImage && slide.photoAva) {
        const fileName = getFileNameFromUrl(slide.photoAva);
        await deleteFileFromS3(fileName, 'images/slideCard');
      }

      res.json({ message: "Слайд удален", id });
    } else {
      res.status(500).json({ error: "Ошибка при удалении слайда." });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении слайда." });
  }
});

module.exports = router;
