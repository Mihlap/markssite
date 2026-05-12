import React from 'react';
import s from './Styles.module.css';

export default function MarksSpinner({ title = 'name' }) {
  return (
    <div className={s.wrap}>
      <p className={s.title}>
        {title} загружается,
        <br /> не обновляйте страницу
      </p>
      <div className={s.background}>
        <div className={s.spinner} />
      </div>
    </div>
  );
}
