// frontend/src/UI/NavBar/const/routes.js
export const baseNavConfig = {
  primary: [
    { label: 'Главная', path: '/' },
    { label: 'Проекты', path: '/project' },
    { label: 'Публикации', path: '/publication' },
    { label: 'Контакты', path: '/contacts' },
    { label: 'О Компании', path: '/company' },
    { label: 'HR портал', path: '/hr/vacanciesMain' },
  ],
  cta: [
    { label: 'Обсудить проект', path: '/no-name', variant: 'cta-primary' },
    { label: 'EN', path: 'https://marksgroup.org/', external: true },
  ],
};

export const hrNavConfig = {
  primary: [
    { label: 'Главная', path: '/hr/vacanciesMain' },
    { label: 'Работа у нас', path: '/hr/vacancies' },
    { label: 'Стажировки', path: '/hr/internships' },
  ],
  cta: [{ label: 'Хочу работать у вас!', path: '/no-name', variant: 'cta-secondary' }],
};
