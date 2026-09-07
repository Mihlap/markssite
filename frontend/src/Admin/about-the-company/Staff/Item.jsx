import React from 'react';
import { Icon6 } from '../../ui/EntityRow/icon';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import { isStaffVisibleInCategory } from '../../../Company/utils/staffVisibility';
import { reorderFullName } from '../../../Company/utils/reorderFullName';
import s from './Styles.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;
const NO_PHOTO = `${bucket_url}/images/imageStaff/no_photo.png`;

const photoSrc = (item) => {
  const key = item?.img;
  if (!key) return NO_PHOTO;
  const val = String(key);
  if (/^https?:\/\//i.test(val)) return val;
  const base = String(bucket_url || '').replace(/\/+$/, '');
  if (val.includes('/')) return `${base}/${val.replace(/^\/+/, '')}`;
  return `${base}/images/imageStaff/${val}`;
};

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
        <img className={s.itemImg} src={photoSrc(el)} alt="staff" onError={(e) => { e.currentTarget.src = NO_PHOTO; }} />
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
      <div className={s.itemName}>{reorderFullName(el?.name)}</div>
    </div>
  );
};

export default Item;
