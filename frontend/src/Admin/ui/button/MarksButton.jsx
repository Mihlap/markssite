import React from 'react';
import clsx from 'clsx';
import { Icon0 } from '../index.js';
import styles from './Styles.module.scss';

const ICON_COLOR = {
  'dashed-orange': 'orange',
  'dashed-blue': 'blue',
};

export default function MarksButton({
  variant = '', // 'dashed-orange' | 'dashed-blue'
  color = '', // 'blue' | 'gray' | 'los'
  size = 'normal', // 'normal' | 'large' | 'card'
  icon = false,
  iconSize = 'normal',
  disabled = false,
  onClick,
  children,
  type = 'button',
  className,
}) {
  const cls = clsx(
    styles.button,
    styles[variant],
    styles[color],
    styles[size],
    disabled && styles.disabled,
    className,
  );

  const iconColor = ICON_COLOR[variant];

  return (
    <button className={cls} disabled={disabled} type={type} onClick={onClick}>
      {icon && (
        <span className={styles.icon}>
          <Icon0 size={iconSize} color={iconColor} />
        </span>
      )}
      {children && <span className={styles.label}>{children}</span>}
    </button>
  );
}
