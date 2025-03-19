import React, { useState, useCallback, useMemo, useEffect } from 'react';
import styles from './CategoryFilters.module.scss';

const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.floor((r * (100 - percent)) / 100));
  g = Math.max(0, Math.floor((g * (100 - percent)) / 100));
  b = Math.max(0, Math.floor((b * (100 - percent)) / 100));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

const CategoryButton = React.memo(function CategoryButton({ cat, count, isActive, color, icon, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);
  const handleClick = useCallback(() => onClick(cat), [onClick, cat]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const backgroundColor = useMemo(() => {
    if (isActive) {
      return hovered ? darkenColor(color, 20) : color;
    } else {
      if (isSmallScreen) {
        return 'var(--light-light-gray-EDEDED)';
      } else {
        return hovered ? 'var(--light-light-gray-EDEDED)' : 'var(--white-F6F6F6)';
      }
    }
  }, [isActive, hovered, color, isSmallScreen]);

  const textColor = isActive ? '#fff' : 'var(--black-1D2E43)';
  const circleBgColor = isActive ? '#fff' : color;
  const circleIconColor = isActive ? color : '#fff';

  return (
    <button
      type="button"
      className={styles.categoryButton}
      onClick={handleClick}
      onMouseEnter={isSmallScreen ? undefined : handleMouseEnter}
      onMouseLeave={isSmallScreen ? undefined : handleMouseLeave}
      style={{
        backgroundColor,
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
      <span className={styles.categoryText}>{cat}</span>
      {count > 0 && <span className={styles.categoryCount}>{count}</span>}
    </button>
  );
});

export default CategoryButton;
