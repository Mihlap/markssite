import clsx from 'clsx';
import s from './Tab.module.css';

export default function Tab({
  label,
  isActive,
  disabled,
  onClick,
  className,
  iconLeft,
  iconRight,
  option = 'default', // 'default' | 'city' | 'tab'
}) {
  return (
    <button
      className={clsx(
        s.button, // Базовый класс применяется всегда
        className, // Внешний класс, если передадут
        {
          // Логика для обычной кнопки
          [s.active]: option === 'default' && isActive,

          // Логика для кнопки выбора города (заменяет обычные стили)
          [s.city]: option === 'city' && !isActive,
          [s.cityActive]: option === 'city' && isActive,

          // Логика для таба
          [s.tab]: option === 'tab' && !isActive,
          [s.tabActive]: option === 'tab' && isActive,
        }
      )}
      onClick={onClick}
      disabled={disabled}>
      {iconLeft}
      <p className={s.buttonLabel}>{label}</p>
      {iconRight}
    </button>
  );
}
