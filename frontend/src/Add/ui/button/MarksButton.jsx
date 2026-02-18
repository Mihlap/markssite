import React from 'react';
import {Icon0} from '../index.js';
import styles from './Styles.module.scss';

export default function MarksButton({ className, defaultStyle = 'blue', icon = false, size = 'normal', disabled = false, onClick, children }) {
  const colorClass = disabled ? `${defaultStyle}-disabled` : defaultStyle;
  const sizeClass = size !== 'normal' ? styles[size] : '';
  const orange = defaultStyle === 'constructor' ? 'var(--salmon-FF7F6A)' : 'var(--white-F6F6F6)';

  console.log(defaultStyle);

  return (
    <button
      className={`${styles.button} ${styles[colorClass]} ${sizeClass} ${className || ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon0 color={orange} />}
      {children}
    </button>
  );
}
