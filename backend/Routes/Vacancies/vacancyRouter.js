const express = require('express');
const { sequelize } = require('../../db/models');

const {
  Employee,
  VacanciesMain
} = require('../../db/models');

const router = express.Router();

const syncVacancyMain = async (vacancyId) => {
  const vacancy = await Employee.findByPk(vacancyId);
  if (vacancy) {
    const vacancyData = vacancy.toJSON();
    const vacancyMainEntry = await VacanciesMain.findOne({
      where: {
        IdVacancy: vacancy.id
      }
    });
    if (vacancyMainEntry) {
      await vacancyMainEntry.update({
        vacancy: vacancyData,
        IdVacancy: vacancy.id,
      });
    }
  }
};

// Маршрут для добавления новой вакансии
router.post('/addVacancy', async (req, res) => {
  try {
    const formData = req.body;

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

    await newVacancy.save();

    res.status(201).json({
      message: 'Вакансия успешно добавлена'
    });
  } catch (error) {
    console.error('Ошибка при добавлении вакансии:', error);
    res.status(500).json({
      message: 'Ошибка сервера при добавлении вакансии'
    });
  }
});

router.post('/copyVacancy/:id', async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const vacancyToCopy = await Employee.findByPk(id);

    if (!vacancyToCopy) {
      return res.status(404).json({
        error: 'Вакансия для копирования не найдена'
      });
    }

    const copiedVacancyData = {
      ...vacancyToCopy.toJSON(),
      id: null
    };
    const newVacancy = await Employee.create(copiedVacancyData);

    if (!newVacancy) {
      throw new Error('Не удалось создать копию вакансии');
    }
    res.status(201).json({
      message: 'Вакансия успешно скопирована',
      copiedId: newVacancy.id
    });

  } catch (error) {
    console.error('Ошибка при копировании вакансии:', error);
    res.status(500).json({
      message: 'Ошибка сервера при копировании вакансии'
    });
  }
});



// изменяем  данные вакансии
router.put('/editVacancy/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    const existingVacancy = await Employee.findByPk(id);

    if (!existingVacancy) {
      return res.status(404).json({
        error: 'Вакансии не найдено'
      });
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
    }, {
      where: {
        id
      }
    });

    await syncVacancyMain(id);
    res.json({
      message: 'Вакансия успешно обновлена'
  });
  } catch (error) {
      console.error('Ошибка при обновлении вакансии:', error);
      res.status(500).json({
          message: 'Ошибка сервера при обновлении вакансии'
      });
  }  
});


// изменяем  данные вакансии, свойство hidden
router.put('/updateVacancyLookStatus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;

    const updated = await Employee.update({ hidden }, {
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


// получаем  данные вакансии, свойство hidden
router.get('/getHiddenVacancies', async (req, res) => {
  try {
    const {
      hidden
    } = req.query;
    let data;
    if (hidden) {
      data = await Employee.findAll({
        where: {
          hidden
        },
      });
    } else {
      data = await Employee.findAll();
    }
    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении скрытых вакансий:', error);
    res.status(500).json({
        error: 'Внутренняя ошибка сервера'
    });
}
});


// получение данных формы
router.get('/getzapros', async (req, res) => {
  try {
    const data = await Employee.findAll({ order: [['id', 'ASC']] });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Произошла ошибка при получении данных формы.'
    });
  }
});

router.get('/vacancies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Employee.findByPk(id);

    if (!data) {
      return res.status(404).json({
        error: 'Вакансия с указанным идентификатором не найден.'
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Произошла ошибка при получении данных.'
    });
  }
});


router.get('/getzapros-filter', async (req, res) => {
  try {
    const {
      direction
    } = req.query;
    let data;

    if (direction && direction !== 'Все') {
      data = await Employee.findAll({
        where: {
          direction
        },
      });
    } else {
      data = await Employee.findAll();
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Произошла ошибка при получении вакансий.'
    });
  }
});


router.get('/getzapros-modalFilter', async (req, res) => {
  try {
    const filters = req.query;
    const whereCondition = {};

    const filterMappings = {
      "Требуемый опыт работы": "experience",
      'Локация': 'locationStaff',
      "Режим работы": "modeOperating",
      "Занятость": "busyness",      
    };
    
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== 'Все') {
        const columnName = filterMappings[key] || key;
        whereCondition[columnName] = filters[key];
      }
    });
    
    const filteredVacancies = await Employee.findAll({
      where: whereCondition,
    });
    res.json(filteredVacancies);
  } catch (error) {
    console.error('Ошибка при фильтрации вакансий:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});


// удаление вакансии
router.delete('/deletezapros/:id', async (req, res) => {
  const { id } = req.params;
  
  // Начало транзакции
  const transaction = await sequelize.transaction();

  try {
    // Попытка удалить связанную запись из другой таблицы
    const vacancyMainEntry = await VacanciesMain.findOne({ where: { IdVacancy: id }, transaction });
    if (vacancyMainEntry) {
      await vacancyMainEntry.destroy({ transaction });
    }

    // Удаление вакансии из модели Employee
    await Employee.destroy({ where: { id }, transaction });

    // Подтверждение транзакции
    await transaction.commit();
    res.json({
      message: 'Вакансия и связанная запись успешно удалены',
      id
    });
  } catch (error) {
    // Откат транзакции в случае ошибки
    await transaction.rollback();
    console.error('Ошибка при удалении вакансии:', error);
    res.status(500).json({
      error: 'Произошла ошибка при удалении вакансии.'
    });
  }
});


module.exports = router;
