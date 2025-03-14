import React from 'react';
import styles from './CategoryFilters.module.scss';

const CategoryButton = React.memo(function CategoryButton({ cat, count, isActive, color, icon, onClick }) {
  
  const pillBgColor = isActive ? color : null;
  const textColor = isActive ? '#fff' : 'var(--black-1D2E43)';
  const circleBgColor = isActive ? '#fff' : color;
  const circleIconColor = isActive ? color : '#fff';

  return (
    <button
      type="button"
      className={styles.categoryButton}
      onClick={() => onClick(cat)}
      style={{
        backgroundColor: pillBgColor,
        color: textColor,      
      }}>
      {icon && (
        <span
          className={styles.iconCircle}
          style={{
            backgroundColor: circleBgColor,
            color: circleIconColor,
          }}>
          {icon}
        </span>
      )}
      <span className={styles.categoryText}>
        {cat}
      </span>
        {count > 0 && <span className={styles.categoryCount}>{count}</span>}
    </button>
  );
});

export default CategoryButton;
