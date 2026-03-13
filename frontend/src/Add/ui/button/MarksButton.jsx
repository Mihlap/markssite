import React from 'react';
import {Icon0} from '../index.js';
import styles from './Styles.module.scss';

export default function MarksButton({ className, defaultStyle = 'blue', blueDashed = false, icon = false, size = 'normal', iconSize = 'normal', disabled = false, onClick, children, type = 'button' }) {
  const colorClass = disabled ? `${defaultStyle}-disabled` : defaultStyle;
  const sizeClass = size !== 'normal' ? styles[size] : '';

  let iconColor = 'var(--white-F6F6F6)';
  if (blueDashed) iconColor = 'var(--blue-75BBFD)';
  else if (defaultStyle === 'constructor') iconColor = 'var(--salmon-FF7F6A)';

  return (
    <button
      className={`${styles.button} ${blueDashed ? styles.blueDashed : styles[colorClass]} ${sizeClass} ${className || ''}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {icon && <Icon0 color={iconColor} size={iconSize} />}
      {children}
    </button>
  );
}
