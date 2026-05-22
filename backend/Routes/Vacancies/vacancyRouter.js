const express = require('express');
const { sequelize } = require('../../db/models');

const {
  Employee,
  VacanciesMain
} = require('../../db/models');
const { logResourceActionFromSession } = require('../../utils/fileLogger');

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

router.post('/addVacancy', async (req, res) => {
  try {
    const formData = req.body;

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
      requirements: formData.textBlock3,
      type: formData.type,
      hidden: formData.hidden,
    });

    await newVacancy.save();

    const resourceType = formData.type === 'стажировка' ? 'internship' : 'vacancy';
    const resourceName = formData.title || (formData.type === 'стажировка' ? 'Стажировка' : 'Вакансия');

    logResourceActionFromSession(req, {
      action: 'CREATE',
      resourceType,
      resourceId: newVacancy.id.toString(),
      resourceName,
    });

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

    const resourceType = newVacancy.type === 'стажировка' ? 'internship' : 'vacancy';
    const resourceName = newVacancy.title || (newVacancy.type === 'стажировка' ? 'Стажировка (копия)' : 'Вакансия (копия)');

    logResourceActionFromSession(req, {
      action: 'CREATE',
      resourceType,
      resourceId: newVacancy.id.toString(),
      resourceName,
    });

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

    const normalizeValue = (value, existingValue) => {
      if (value === undefined || value === null) {
        return existingValue;
      }
      if (typeof value === 'object' && value?.value !== undefined) {
        return value.value;
      }
      return value;
    };

    const normalizeBoolean = (value, existingValue) => {
      if (value === undefined || value === null) {
        return existingValue;
      }
      if (typeof value === 'string') {
        return value === 'true' || value === '1';
      }
      return Boolean(value);
    };

    const normalizeString = (value) => {
      if (value === null || value === undefined) {
        return '';
      }
      return String(value);
    };

    const newTitle = normalizeString(formData.title ?? existingVacancy.title);
    const newDirection = normalizeValue(formData.direction, existingVacancy.direction);
    const newExperience = normalizeValue(formData.experience, existingVacancy.experience);
    const newLocation = normalizeValue(formData.location, existingVacancy.locationStaff);
    const newBusyness = normalizeValue(formData.busyness, existingVacancy.busyness);
    const newWorkMode = normalizeValue(formData.workMode, existingVacancy.modeOperating);
    const newSkills = normalizeString(formData.skills ?? existingVacancy.skills);
    const newBenefits = normalizeString(formData.benefits ?? existingVacancy.advantages);
    const newTextBlock1 = normalizeString(formData.textBlock1 ?? existingVacancy.searchStaff);
    const newTextBlock2 = normalizeString(formData.textBlock2 ?? existingVacancy.haveToWork);
    const newTextBlock3 = normalizeString(formData.textBlock3 ?? existingVacancy.requirements);
    const newType = normalizeString(formData.type ?? existingVacancy.type);
    const newHidden = normalizeBoolean(formData.hidden, existingVacancy.hidden);

    const oldTitle = normalizeString(existingVacancy.title);
    const oldDirection = normalizeValue(existingVacancy.direction, existingVacancy.direction);
    const oldExperience = normalizeValue(existingVacancy.experience, existingVacancy.experience);
    const oldLocation = normalizeValue(existingVacancy.locationStaff, existingVacancy.locationStaff);
    const oldBusyness = normalizeValue(existingVacancy.busyness, existingVacancy.busyness);
    const oldWorkMode = normalizeValue(existingVacancy.modeOperating, existingVacancy.modeOperating);
    const oldSkills = normalizeString(existingVacancy.skills);
    const oldBenefits = normalizeString(existingVacancy.advantages);
    const oldTextBlock1 = normalizeString(existingVacancy.searchStaff);
    const oldTextBlock2 = normalizeString(existingVacancy.haveToWork);
    const oldTextBlock3 = normalizeString(existingVacancy.requirements);
    const oldType = normalizeString(existingVacancy.type);
    const oldHidden = normalizeBoolean(existingVacancy.hidden, existingVacancy.hidden);

    const hasChanges =
      oldTitle !== newTitle ||
      oldDirection !== newDirection ||
      oldExperience !== newExperience ||
      oldLocation !== newLocation ||
      oldBusyness !== newBusyness ||
      oldWorkMode !== newWorkMode ||
      oldSkills !== newSkills ||
      oldBenefits !== newBenefits ||
      oldTextBlock1 !== newTextBlock1 ||
      oldTextBlock2 !== newTextBlock2 ||
      oldTextBlock3 !== newTextBlock3 ||
      oldType !== newType ||
      oldHidden !== newHidden;

    await Employee.update({
      title: newTitle || existingVacancy.title,
      direction: newDirection ?? existingVacancy.direction,
      experience: newExperience ?? existingVacancy.experience,
      locationStaff: newLocation ?? existingVacancy.locationStaff,
      busyness: newBusyness ?? existingVacancy.busyness,
      modeOperating: newWorkMode ?? existingVacancy.modeOperating,
      skills: newSkills || existingVacancy.skills,
      advantages: newBenefits || existingVacancy.advantages,
      searchStaff: newTextBlock1 || existingVacancy.searchStaff,
      haveToWork: newTextBlock2 || existingVacancy.haveToWork,
      requirements: newTextBlock3 || existingVacancy.requirements,
      type: newType || existingVacancy.type,
      hidden: newHidden,
    }, {
      where: {
        id
      }
    });

    await syncVacancyMain(id);

    const resourceType = formData.type === 'стажировка' || existingVacancy.type === 'стажировка' ? 'internship' : 'vacancy';
    const resourceName = formData.title || existingVacancy.title || (existingVacancy.type === 'стажировка' ? 'Стажировка' : 'Вакансия');

    logResourceActionFromSession(req, {
      action: 'UPDATE',
      resourceType,
      resourceId: id,
      resourceName,
      hasChanges,
    });

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

router.put('/updateVacancyLookStatus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;

    const vacancy = await Employee.findByPk(id);
    if (!vacancy) {
      return res.status(404).json({ error: 'Вакансия не найдена' });
    }

    const hasChanges = vacancy.hidden !== hidden;

    const updated = await Employee.update({ hidden }, {
      where: { id }
    });

    if (updated) {
      const resourceType = vacancy.type === 'стажировка' ? 'internship' : 'vacancy';
      const resourceName = vacancy.title || (vacancy.type === 'стажировка' ? 'Стажировка' : 'Вакансия');

      logResourceActionFromSession(req, {
        action: 'UPDATE',
        resourceType,
        resourceId: id,
        resourceName,
        hasChanges,
      });

      res.json({ message: 'Статус вакансии успешно обновлен', id, hidden });
    } else {
      res.status(404).json({ error: 'Вакансия не найдена' });
    }
  } catch (error) {
    console.error('Ошибка обновления статуса вакансии:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса вакансии' });
  }
});

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

router.delete('/deletezapros/:id', async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    const vacancy = await Employee.findByPk(id, { transaction });
    const vacancyTitle = vacancy?.title || 'Вакансия';

    const vacancyMainEntry = await VacanciesMain.findOne({ where: { IdVacancy: id }, transaction });
    if (vacancyMainEntry) {
      await vacancyMainEntry.destroy({ transaction });
    }

    await Employee.destroy({ where: { id }, transaction });

    await transaction.commit();

    const resourceType = vacancy?.type === 'стажировка' ? 'internship' : 'vacancy';
    const resourceName = vacancyTitle || (vacancy?.type === 'стажировка' ? 'Стажировка' : 'Вакансия');

    logResourceActionFromSession(req, {
      action: 'DELETE',
      resourceType,
      resourceId: id,
      resourceName,
    });

    res.json({
      message: 'Вакансия и связанная запись успешно удалены',
      id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка при удалении вакансии:', error);
    res.status(500).json({
      error: 'Произошла ошибка при удалении вакансии.'
    });
  }
});

module.exports = router;
