import React, { useState, useEffect, useCallback } from 'react';
import { Icon1, Icon2, Icon3, Icon4, Icon6, Icon7 } from './icon';
import s from './Styles.module.css';

// role === manager он видит все блоки кроме кнопки delete
// role === admin видит все блоки
// visible === event показывается кнопка drag скрывается desc
// visible === legenda скрывается id

export default function MarksEntityRow({ title, desc, id, role, visible, hidden = false, onEdit, onToggle, onDelete }) {
  const isEvent = visible === 'event';
  const isLegenda = visible === 'legenda';
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCopyId = useCallback(() => {
    navigator?.clipboard?.writeText(String(id)).catch(() => {});
    setIsCopied(true);
  }, [id]);

  return (
    <div className={s.entily}>
      <div className={s.content}>
        <div className={s.title}>{title}</div>
        {!isEvent && desc && <div className={s.desc}>{desc}</div>}
      </div>
      <div className={s.control}>
        {!isLegenda && id !== undefined && (
          <div className={s.id}>
            <div>id: {id}</div>
            <button title="скопировать id" className={s.copy} type="button" onClick={handleCopyId}>
              {isCopied && <div className={s.copyMessage}>id скопирован</div>}
              <Icon7 />
            </button>
          </div>
        )}
        <div className={s.wrapbtn}>
          <button
            title={`${hidden ? 'показать' : 'скрыть'}`}
            className={`${s.btn} ${hidden ? s.btnHidden : ''}`}
            type="button"
            onClick={onToggle}>
            {hidden ? <Icon2 /> : <Icon3 />}
          </button>
          <button title="редактировать" className={s.btn} type="button" onClick={onEdit}>
            <Icon1 />
          </button>
          {role === 'admin' && (
            <button title="удалить" className={s.btn} type="button" onClick={onDelete}>
              <Icon4 />
            </button>
          )}
              </div>
        {(isEvent || isLegenda) && (
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
