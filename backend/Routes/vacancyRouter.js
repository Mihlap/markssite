const express = require('express');

const { Employee } = require('../db/models');

const router = express.Router();
// Маршрут для добавления новой вакансии
router.post('/addVacancy', async (req, res) => {
  try {
    // Получаем данные формы из запроса
    const formData = req.body;
    
    // Создаем новую запись в базе данных с использованием модели вакансии
    const newVacancy = new Employee({
      title: formData.title,
      direction: formData.direction.value,
      experience: formData.experience.value,
      locationStaff: formData.location.value,
      busyness: formData.busyness.value,
      modeOperating: formData.workMode.value,
      skills: formData.skills,
      advantages: formData.benefits,
      searchStaff: formData.textBlock1,
      haveToWork: formData.textBlock2,
      requirements: formData.textBlock3,
      type: formData.type,
      hidden: formData.hidden,
    });

    // Сохраняем новую вакансию в базе данных
    await newVacancy.save();

    // Отправляем ответ об успешном добавлении вакансии
    res.status(201).json({ message: 'Вакансия успешно добавлена' });
  } catch (error) {
    // В случае ошибки отправляем ответ с ошибкой
    console.error('Ошибка при добавлении вакансии:', error);
    res.status(500).json({ message: 'Ошибка сервера при добавлении вакансии' });
  }
});

router.post('/copyVacancy/:id', async (req, res) => {
  try {
    // Получаем идентификатор вакансии для копирования из параметров запроса
    const { id } = req.params;

    // Находим вакансию по идентификатору
    const vacancyToCopy = await Employee.findByPk(id);

    // Если вакансия не найдена, возвращаем ошибку 404
    if (!vacancyToCopy) {
      return res.status(404).json({ error: 'Вакансия для копирования не найдена' });
    }

 // Создаем копию вакансии
 const copiedVacancyData = { ...vacancyToCopy.toJSON(), id: null }; // Копируем все поля, кроме идентификатора

 // Сохраняем копию вакансии в базе данных
 const newVacancy = await Employee.create(copiedVacancyData);

 if (!newVacancy) {
  throw new Error('Не удалось создать копию вакансии');
}
    // Отправляем ответ об успешном копировании вакансии
    res.status(201).json({ message: 'Вакансия успешно скопирована', copiedId: newVacancy.id });

  } catch (error) {
    console.error('Ошибка при копировании вакансии:', error);
    res.status(500).json({ message: 'Ошибка сервера при копировании вакансии' });
  }
});



// изменяем  данные вакансии
router.put('/editVacancy/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    const existingVacancy = await Employee.findByPk(id);

    if (!existingVacancy) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    await Employee.update({
      title: formData.title,
      direction: formData.direction,
      experience: formData.experience,
      locationStaff: formData.location,
      busyness: formData.busyness,
      modeOperating: formData.workMode,
      skills: formData.skills,
      advantages: formData.benefits,
      searchStaff: formData.textBlock1,
      haveToWork: formData.textBlock2,
      requirements: formData.textBlock3,
      type: formData.type,
      hidden: formData.hidden,
    }, { where: { id } });

    res.json({ message: 'Vacancy successfully updated' });
  } catch (error) {
    console.error('Error updating vacancy:', error);
    res.status(500).json({ message: 'Server error while updating vacancy' });
  }
});

router.put('/updateVacancyLookStatus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;

    const existingVacancy = await Employee.findByPk(id);

    if (!existingVacancy) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    await Employee.update({ hidden }, { where: { id } });

    res.json({ message: 'Vacancy look status successfully updated' });
  } catch (error) {
    console.error('Error updating vacancy look status:', error);
    res.status(500).json({ message: 'Server error while updating vacancy look status' });
  }
});

router.get('/getHiddenVacancies', async (req, res) => {
  try {
    const { hidden } = req.query;
    let data;

    if (hidden) {
      // Здесь нужно использовать правильный способ поиска скрытых вакансий в вашей базе данных
      data = await Employee.findAll({
        where: { hidden: true }, // Используйте соответствующее поле, указывающее на скрытость вакансии
      });
    } else {
      // Возвращаем все вакансии, если параметр hidden не указан
      data = await Employee.findAll();
    }

    res.json(data);
  } catch (error) {
    // Если произошла ошибка, отправляем клиенту сообщение об ошибке
    console.error('Error while fetching hidden vacancies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Маршрут для получения данных формы
router.get('/getzapros', async (req, res) => {
  try {
    const data = await Employee.findAll({});
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при получении данных формы.' });
  }
});


router.get('/getzapros-filter', async (req, res) => {
  try {
    const { direction } = req.query;
    let data;

    if (direction && direction !== 'Все') {
      data = await Employee.findAll({
        where: { direction },
      });
    } else {
      data = await Employee.findAll();
    }

     res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Произошла ошибка при получении вакансий.' });
  }
});



// Маршрут для удаления вакансии
router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.destroy({ where: { id } });
    res.json({ id });
  } catch (error) {
    console.error('Ошибка при удалении вакансии:', error);
    res.status(500).json({ error: 'Произошла ошибка при удалении вакансии.' });
  }
});



module.exports = router;
