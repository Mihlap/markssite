import React from 'react';

import s from './Styles.module.css';
import { UiMarksButton } from '..';

export default function MarksAlert({ title, desc, isDelete, onConfirm, onCancel }) {
  return (
    <section className={s.alert}>
      <button className={s.close_button} onClick={onCancel} />
      <div className={s.wrap}>
        <div className={s.title}>{title}</div>
        <div className={s.desc}>{desc}</div>
      </div>
      <div className={s.wrapBtn}>
        <UiMarksButton onClick={onConfirm}>
          {isDelete ? 'Удалить' : 'Не сохранять'}
        </UiMarksButton>
        <UiMarksButton defaultStyle="gray" onClick={onCancel}>
          Отмена
        </UiMarksButton>
      </div>
    </section>
  );
}
