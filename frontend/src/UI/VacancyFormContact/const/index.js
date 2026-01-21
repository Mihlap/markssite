export const directionOptions = [
  { value: 'Другое направление', label: 'Другое направление' },
  { value: 'Архитектура', label: 'Архитектура' },
  { value: 'Конструктив', label: 'Конструктив' },
  { value: 'Инженерия', label: 'Инженерия' },
  { value: 'Научно-техническое сопровождение', label: 'Научно-техническое сопровождение' },
  { value: 'BIM', label: 'BIM' },
  { value: 'Аналитика', label: 'Аналитика' },
  { value: 'Финансы', label: 'Финансы' },
  { value: 'Дизайн', label: 'Дизайн' },
  { value: 'IT', label: 'IT' },
  { value: 'Администрирование', label: 'Администрирование' },
  { value: 'Бэк офис', label: 'Бэк офис' },
  { value: 'Стажировки', label: 'Стажировки' },
  { value: 'Управление', label: 'Управление' },
];

export const maskOptions = {
  mask: '+7 (___) ___-__-__',
  replacement: { _: /\d/ },
};

export const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
