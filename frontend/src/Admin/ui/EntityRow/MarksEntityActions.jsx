import React from 'react';
import { Icon1, Icon2, Icon3, Icon4 } from './icon';
import s from './Styles.module.css';

export default function MarksEntityActions({ canDelete, hidden, onEdit, onToggle, onDelete }) {
  return (
    <div className={s.wrapbtn}>
      {onToggle && (
        <button
          title={`${hidden ? 'показать' : 'скрыть'}`}
          className={`${s.btn} ${hidden ? s.btnHidden : ''}`}
          type="button"
          onClick={onToggle}>
          {hidden ? <Icon2 /> : <Icon3 />}
        </button>
      )}
      {onEdit && (
        <button title="редактировать" className={s.btn} type="button" onClick={onEdit}>
          <Icon1 />
        </button>
      )}
      {canDelete && onDelete && (
        <button title="удалить" className={s.btn} type="button" onClick={onDelete}>
          <Icon4 />
        </button>
      )}
    </div>
  );
}
