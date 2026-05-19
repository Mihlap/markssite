'use strict';

const { Project, Constructor } = require('./db/models');

const VIEWS = [
  'Архитектура и концепция',
  'Градостроительство и генплан',
  'Конструктив',
  'Инженерия',
  'Геотехника',
];

const CITIES = [
  'Россия, Москва',
  'Россия, Санкт-Петербург',
  'Россия, Грозный',
  'Россия, Тюмень',
  'Россия, Екатеринбург',
];

async function seed(count = 50) {
  const projects = [];

  for (let i = 1; i <= count; i++) {
    projects.push({
      title: `Тестовый проект ${i}`,
      viewConstruction: VIEWS[i % VIEWS.length],
      countryCity: CITIES[i % CITIES.length],
      monthYear: `0${(i % 12) + 1}.202${i % 5}`,
      descriptionProject: `Описание тестового проекта номер ${i}`,
      totalArea: `${i * 100} кв.м`,
    });
  }

  await Project.bulkCreate(projects);
  console.log(`Создано ${count} тестовых проектов`);
  process.exit(0);
}

seed(50).catch((err) => {
  console.error(err);
  process.exit(1);
});
