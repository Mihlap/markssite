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
