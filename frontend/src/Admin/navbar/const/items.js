import { Icon1, Icon2, Icon3, Icon4, Icon5, Icon6 } from '../icon';

const MENU_ITEMS = [
  { name: 'home', path: '/admin/home', Icon: Icon1, label: 'Главная', roles: ['Pokemon', 'obezyankaa', 'manager'] },
  { name: 'add-a-project', path: '/admin/add-a-project', Icon: Icon2, label: 'Проекты', roles: ['Pokemon', 'obezyankaa', 'manager'] },
  { name: 'add-a-articles', path: '/admin/add-a-articles', Icon: Icon3, label: 'Публикации', roles: ['Pokemon', 'obezyankaa', 'manager'] },
  { name: 'add-a-company', path: '/admin/add-a-company', Icon: Icon4, label: 'О компании', roles: ['Pokemon', 'obezyankaa', 'manager'] },
  { name: 'add-hr-portal', path: '/admin/add-hr-portal', Icon: Icon5, label: 'HR портал', roles: ['Pokemon', 'obezyankaa', 'hr778'] },
  { name: 'add-a-applications', path: '/admin/add-a-applications', Icon: Icon6, label: 'Управление', roles: ['Pokemon', 'obezyankaa'] },
];

export default MENU_ITEMS;