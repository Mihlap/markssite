import React from 'react';
import styles from './ButtonAdm.module.scss';

export default function ButtonAdm({ className, property1 = 'normal', disabled = false, onClick, children = 'Сохранить' }) {
  const stateClass = disabled ? 'disable' : property1;

  return (
    <button
      className={`${styles.button} ${styles[stateClass]} ${className || ''}`}
      disabled={disabled}
      onClick={onClick}
      data-node-id="2439-11994"
    >
      {children}
    </button>
  );
}
