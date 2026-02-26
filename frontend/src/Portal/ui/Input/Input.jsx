import React from 'react';
import { InputMask } from '@react-input/mask';
import styles from './styles.module.css';

const Input = React.forwardRef(function Input(
  {
    type = 'text',
    placeholder,
    label,
    error,
    disabled,
    className,
    mask,
    replacement,
    showMask = true,
    inputMode,
    autoComplete,
    ...rest
  },
  ref
) {
  const resolvedPlaceholder = placeholder ?? (mask ? ' ' : undefined);
  const resolvedInputMode = inputMode ?? (mask ? 'tel' : undefined);

  const sharedProps = {
    ref,
    type,
    placeholder: resolvedPlaceholder,
    disabled,
    inputMode: resolvedInputMode,
    autoComplete,
    className: `${styles.input} ${error ? styles.inputError : ''} ${className || ''}`,
    ...rest,
  };

  return (
    <label className={styles.wrapper}>
      {mask ? (
        <InputMask {...sharedProps} mask={mask} replacement={replacement} showMask={showMask} />
      ) : (
        <input {...sharedProps} />
      )}

      {label && <span className={styles.label}>{label}</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
});

export default Input;
