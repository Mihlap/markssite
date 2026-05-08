import React, { forwardRef } from 'react';
import { Icon6 } from '../../ui/EntityRow/icon';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import photoSrc from './utils/photo';
import s from './Styles.module.css';

const Item = forwardRef(({ el, withOpacity, isDragging, style, dragListeners, dragAttributes, canEdit, canDelete, onEdit, onToggle, onDelete, ...props }, ref) => {
  const inlineStyles = {
    opacity: withOpacity ? '0.5' : '1',
    transformOrigin: '50% 50%',
    cursor: isDragging ? 'grabbing' : 'grab',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  return (
    <div ref={ref} style={inlineStyles} {...props}>
      <div {...dragListeners} {...dragAttributes}>
        <div className={s.wrapImg}>
          <div className={s.iconDrag}>
            <Icon6 />
          </div>
          <img className={s.itemImg} src={photoSrc(el)} alt="staff" />
          <div className={s.wrapBtn}>
            {canEdit && (
              <MarksEntityActions
                canDelete={canDelete}
                hidden={el?.hidden ?? !el?.isVisible}
                onEdit={() => onEdit(el)}
                onToggle={() => onToggle(el)}
                onDelete={() => onDelete(el)}
              />
            )}
          </div>
        </div>
        <div className={s.itemName}>{el?.name}</div>
      </div>
    </div>
  );
});

export default Item;
