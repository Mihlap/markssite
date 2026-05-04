import { forwardRef, memo } from 'react';
import styles from './HomeAdmin.module.scss';

const Item = forwardRef(function DraggableProject(
  { project, id, handleFormDelete, draggableProps, dragHandleProps },
  ref
) {
  const itemId = id ?? project.IdProject;
  return (
    <div ref={ref} className={styles.items} {...draggableProps}>
      {draggableProps && (
      <div className={styles.items__icon_drag} {...dragHandleProps}>
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
      <div className={styles.items__title}>id: {itemId}</div>
      <button className={styles.items__icon_del} onClick={() => handleFormDelete(itemId)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 9L15 15" stroke="#1D2E43" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 9L9 15" stroke="#1D2E43" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
});

export default memo(Item);
