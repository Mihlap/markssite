import React from 'react';
import photoSrc from './utils/photo';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import { Icon6 } from '../../ui/EntityRow/icon';
import s from './Styles.module.css';

export default function StaffList({ items, canDelete, canEdit, onEdit, onToggle, onDelete }) {
  return (
    <ul className={s.list}>
      {items?.map((el) => (
        <li key={el.id} className={s.item}>
          <div className={s.wrapImg}>
            <div className={s.iconDrag}>
              <Icon6 />
            </div>
            <img className={s.itemImg} src={photoSrc(el)} alt="staff" />
            <div className={s.wrapBtn}>
              {canEdit && (
                <MarksEntityActions
                  canDelete={canDelete}
                  hidden={el.hidden ?? !el.isVisible}
                  onEdit={() => onEdit(el)}
                  onToggle={() => onToggle(el)}
                  onDelete={() => onDelete(el)}
                />
              )}
            </div>
          </div>
          <div className={s.itemName}>
            {el.name}
            {el.position ? ` — ${el.position}` : ''}
          </div>
        </li>
      ))}
    </ul>
  );
}
