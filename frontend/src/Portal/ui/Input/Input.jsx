import React from 'react';
import styles from './styles.module.css';

const Input = React.forwardRef(function Input(
  { type = 'text', placeholder, label, error, disabled, className, ...rest },
  ref
) {
  return (
    <label className={styles.wrapper}>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`}
        {...rest}
      />

      {label && <span className={styles.label}>{label}</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
});

export default Input;
