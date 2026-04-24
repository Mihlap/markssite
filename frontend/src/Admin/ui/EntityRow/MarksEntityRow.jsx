import React from 'react';
import { Icon6 } from './icon';
import MarksEntityActions from './MarksEntityActions';
import MarksCopyId from './MarksCopyId';
import s from './Styles.module.css';

// role === manager он видит все блоки кроме кнопки delete
// role === admin видит все блоки
// visible === event показывается кнопка drag скрывается desc
// visible === legenda скрывается id

export default function MarksEntityRow({ title, desc, id, role, visible, hidden = false, onEdit, onToggle, onDelete }) {
  const isEvent = visible === 'event';
  const isLegenda = visible === 'legenda';
  const isSlide = visible === 'slide';

  console.log(title);
  return (
    <div className={s.entily}>
      <div className={`${s.content} ${isLegenda ? s.contentLegenda : ''}`}>
        {title && <div className={`${s.title} ${isLegenda ? s.titleLegenda : ''}`}>{title}</div>}
        <div className={`${s.desc} ${isLegenda ? s.descLegenda : ''}`}>{desc}</div>
      </div>
      <div className={s.control}>
        {!isLegenda && id !== undefined && <MarksCopyId id={id} />}
        <MarksEntityActions
          canDelete={role === 'admin'}
          hidden={hidden}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
        {(isEvent || isLegenda || isSlide) && (
          <button
            title="перетащить"
            className={`${s.drag} ${isEvent ? s.dragIsEvent : ''} ${isLegenda ? s.dragIsLegenda : ''}`}
            type="button">
            <Icon6 />
          </button>
        )}
      </div>
    </div>
  );
}
