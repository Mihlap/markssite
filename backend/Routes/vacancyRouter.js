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
      direction: formData.direction,
      experience: formData.experience,
      locationStaff: formData.location,
      busyness: formData.busyness,
      modeOperating: formData.workMode,
      skills: formData.skills,
      advantages: formData.benefits,
      searchStaff: formData.textBlock1,
      haveToWork: formData.textBlock2,
      requirements: formData.textBlock3
    });

    console.log('New vacancy object:', newVacancy.toJSON());

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

module.exports = router;
