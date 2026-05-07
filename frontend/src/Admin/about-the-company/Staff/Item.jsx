import React, { forwardRef } from 'react';
import { Icon6 } from '../../ui/EntityRow/icon';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import photoSrc from './utils/photo';
import s from './Styles.module.css';

const Item = forwardRef(({ el, withOpacity, isDragging, style, dragListeners, dragAttributes, canEdit, canDelete, onEdit, onToggle, onDelete, ...props }, ref) => {
  const inlineStyles = {
    opacity: withOpacity ? '0.5' : '1',
    transformOrigin: '50% 50%',
    // height: '140px',
    // width: '140px',
    // borderRadius: '10px',
    cursor: isDragging ? 'grabbing' : 'grab',
    // backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // boxShadow: isDragging
    //   ? 'rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px'
    //   : 'rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px',
    // transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    ...style,
  };

  return (
    <div ref={ref} style={inlineStyles} {...props}>
      <div className={s.item} {...dragListeners} {...dragAttributes}>
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
