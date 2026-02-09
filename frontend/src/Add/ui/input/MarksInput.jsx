import { memo } from 'react';

import styles from './Styles.module.css';

function MarksInput({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  autoComplete = 'off',
  placeholder,
  measurement,
  maxLength,
  className,
}) {
  const showMeasurement = measurement && value;
  const showCounter = maxLength != null;

  return (
    <div className={`${styles.input} ${className || ''}`}>
      <input
        type={type}
        className={`${styles.input__field} ${showCounter ? styles.input__field_bordered : ''} ${disabled ? styles.input__field_disabled : ''}`}
        placeholder={placeholder || name}
        name={name}
        id={name}
        value={value ?? ''}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
      />
      {showMeasurement && (
        <span className={styles.input__measurement}>{measurement}</span>
      )}
      {showCounter && (
        <div className={styles.input__counter}>
          {`${(value || '').length}/${maxLength}`}
        </div>
      )}
      <label
        htmlFor={name}
        className={`${styles.input__label} ${showCounter ? styles.input__label_top : ''} ${disabled ? styles.input__label_disabled : ''}`}
      >
        {label}
      </label>
    </div>
  );
}

export default memo(
  MarksInput
);
