import React from 'react';
import styles from './Styles.module.scss';

export default function MarksSwitch({ isActive, onClick, activeColor }) {
  return (
    <div
      className={`${styles.toggleButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      style={activeColor ? { '--switch-active-color': activeColor } : undefined}
    >
      <div className={styles.circle} />
    </div>
  );
}
