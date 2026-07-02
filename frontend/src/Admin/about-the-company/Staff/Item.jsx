import React from 'react';
import { Icon6 } from '../../ui/EntityRow/icon';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import photoSrc from './utils/photo';
import { isStaffVisibleInCategory } from '../../../Company/utils/staffVisibility';
import s from './Styles.module.css';

const Item = ({
  el,
  category,
  draggable,
  isDragging,
  onDragStart,
  onDragEnter,
  onDragEnd,
  canEdit,
  canDelete,
  onEdit,
  onToggle,
  onDelete,
}) => {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      style={{
        position: 'relative',
        opacity: isDragging ? 0.6 : 1,
        transition: 'opacity 120ms ease',
        cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}>
      <div className={s.wrapImg}>
        <div className={s.iconDrag}>
          <Icon6 />
        </div>
        <img className={s.itemImg} src={photoSrc(el)} alt="staff" />
        <div className={s.wrapBtn}>
          {canEdit && (
            <MarksEntityActions
              canDelete={canDelete}
              hidden={!isStaffVisibleInCategory(el, category)}
              onEdit={() => onEdit(el)}
              onToggle={() => onToggle(el)}
              onDelete={() => onDelete(el)}
            />
          )}
        </div>
      </div>
      <div className={s.itemName}>{el?.name}</div>
    </div>
  );
};

export default Item;
