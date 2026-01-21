import React from 'react';
import { InputMask } from '@react-input/mask';
import styles from './styles.module.css';

const MaskedInput = React.forwardRef(function MaskedInput(
  { label, error, mask, replacement, placeholder = ' ', ...rest },
  ref
) {
  return (
    <label className={styles.wrapper}>
      <InputMask
        {...rest}
        mask={mask}
        replacement={replacement}
        showMask
        ref={ref}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />

      {label && <span className={styles.label}>{label}</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
});

export default MaskedInput;
