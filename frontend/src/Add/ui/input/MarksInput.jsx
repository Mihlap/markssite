import { memo } from 'react';
import { ClipIcon } from '../index.js';

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
  color = 'blue',
  buttonText = 'Загрузить изображение',
  accept,
  multiple,
  inputRef,
  hint,
  error,
}) {
  if (type === 'file') {
    const colorClass = styles[`file__button_${color}`] || styles.file__button_blue;

    return (
      <div className={`${styles.file} ${className || ''}`}>
        {label && (
          <div className={styles.file__label_text}>
            {label.includes('*') ? (
              <>
                {label.split('*')[0]}
                <span className={styles.accent}>*{label.split('*')[1]}</span>
              </>
            ) : (
              label
            )}
          </div>
        )}
        <div className={styles.file__row}>
          <label className={`${styles.file__button} ${colorClass}`}>
            <input type="file" name={name} accept={accept} multiple={multiple} ref={inputRef} onChange={onChange} />
            <ClipIcon />
            <span className={styles.file__button_text}>{buttonText}</span>
          </label>
          {/* <div className={styles.file__info}>i</div> */}
        </div>
        {required && hint !== false && <div className={styles.file__hint}>{hint || 'Обязательно для заполнения'}</div>}
      </div>
    );
  }

  const showMeasurement = measurement && value;
  const showCounter = maxLength != null;

  return (
    <div className={`${styles.input} ${showCounter ? styles.input_bordered : ''} ${className || ''}`}>
      <div className={styles.input__wrapper}>
        <input
          type={type}
          className={`${styles.input__field} ${showCounter ? styles.input__field_bordered : ''} ${disabled ? styles.input__field_disabled : ''} ${error ? styles.input__field_error : ''}`}
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
        {showMeasurement && <span className={styles.input__measurement}>{measurement}</span>}
        {showCounter && <div className={styles.input__counter}>{`${(value || '').length}/${maxLength}`}</div>}
      </div>
      <label
        htmlFor={name}
        className={`${styles.input__label} ${showCounter ? styles.input__label_top : ''} ${disabled ? styles.input__label_disabled : ''}`}>
        {label}
      </label>
      {error && <span className={styles.input__error}>{error}</span>}
    </div>
  );
}

export default memo(MarksInput);
