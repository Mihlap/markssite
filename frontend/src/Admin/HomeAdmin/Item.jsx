import { forwardRef } from 'react';
import styles from './HomeAdmin.module.scss';

const Item = forwardRef(({ id, withOpacity, isDragging, style, dragListeners, dragAttributes, onDelete, hideDrag = false, ...props }, ref) => {
  const inlineStyles = {
    opacity: withOpacity ? '0.5' : '1',
    transformOrigin: '50% 50%',
    display: 'flex',
    ...(!hideDrag && { cursor: isDragging ? 'grabbing' : 'grab' }),
    ...style,
  };

  return (
    <div ref={ref} style={inlineStyles} {...props}>
      <div className={styles.items} {...dragListeners} {...dragAttributes}>
          {!hideDrag && (
            <div className={styles.items__icon_drag}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
                <circle cx="8.00161" cy="1.41176" r="1.41176" fill="#BADDFE" />
                <circle cx="8.00161" cy="7.9999" r="1.41176" fill="#BADDFE" />
                <circle cx="8.00161" cy="14.5883" r="1.41176" fill="#BADDFE" />
                <circle cx="1.41176" cy="1.41176" r="1.41176" fill="#BADDFE" />
                <circle cx="1.41176" cy="7.9999" r="1.41176" fill="#BADDFE" />
                <circle cx="1.41176" cy="14.5883" r="1.41176" fill="#BADDFE" />
              </svg>
            </div>
          )}
        <div className={styles.items__title}>id: {id}</div>
        <button className={styles.items__icon_del} onClick={() => onDelete(id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 9L15 15" stroke="#1D2E43" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 9L9 15" stroke="#1D2E43" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default Item;
