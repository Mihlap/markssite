// frontend/src/UI/NavBar/const/routes.js

export const baseNavConfig = {
  primary: [
    { id: 1, type: 'link', label: 'Главная', path: '/' },
    { id: 2, type: 'link', label: 'Проекты', path: '/project' },
    {
      id: 3,
      type: 'dropdown',
      // path: 'null',
      label: 'Публикации',
      children: [
        {
          id: 1,
          label: 'Новости',
          description: 'Научные достижения, интервью и статьи ведущих профессиональных и публицистических изданий',
          path: '/publication',
        },
        { id: 2, label: 'MARKS jornal', description: 'Научный журнал', path: '/journalPage' },
      ],
    },
    { id: 4, type: 'link', label: 'Контакты', path: '/contacts' },
    {
      id: 5,
      type: 'dropdown',
      label: 'О компании',
      path: '/company',
      children: [
        {
          id: 1,
          label: 'История MARKS GROUP',
          description: 'Люди, которые не боятся вызовов и готовы к новым победам',
          path: '/company#history',
        },
        {
          id: 2,
          label: 'Награды и премии',
          description: 'Проекты, отмеченные наградами в разных номинациях',
          path: '/company#awards',
        },
        {
          id: 3,
          label: 'Сотрудники',
          description: 'Наша главная ценность — это команда',
          path: '/company#staff',
        },
      ],
    },
    { id: 6, type: 'link', label: 'HR портал', path: '/hr/home' },
  ],
  cta: [
    { id: 7, type: 'link', label: 'Обсудить проект', path: '/footerForm', variant: 'cta-primary' },
    { id: 8, type: 'external', external: true, label: 'EN', path: 'https://marksgroup.org/', variant: 'cta-secondary' },
  ],
};

export const hrNavConfig = {
  primary: [
    { id: 1, label: 'Главная', path: '/hr/home' },
    { id: 2, label: 'Работа у нас', path: '/hr/vacancies' },
    { id: 3, label: 'Стажировки', path: '/hr/internships' },
  ],
  cta: [{ id: 1, label: 'Хочу работать у вас!', path: '/no-name', variant: 'cta-secondary' }],
};
