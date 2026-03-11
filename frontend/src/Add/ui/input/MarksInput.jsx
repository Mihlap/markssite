import { memo, forwardRef, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ClipIcon, Icon1 } from '../index.js';

import styles from './Styles.module.css';

function FileInput({ name, label, color = 'blue', buttonText = 'Загрузить изображение', accept, multiple, inputRef, onChange, required, hint, info, className }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);
  const wrapperRef = useRef(null);
  const colorClass = styles[`file__button_${color}`] || styles.file__button_blue;
  const infoHref = typeof info === 'string' ? info : '#';

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={`${styles.file} ${className || ''}`}>
      {label && (
        <div className={styles.file__label_text}>
          {label.includes('*') ? (
            <>
              {label.split('*')[0]}
              <span className={`${color === 'salmon' ? styles.accent_salmon : styles.accent}`}>
                *{label.split('*')[1]}
              </span>
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
        {info && (
          <div className={styles.icon1_wrapper} ref={wrapperRef}>
            <button
              className={styles.icon1_trigger}
              onClick={() => setOpen((v) => !v)}
              type="button"
              aria-label="Информация">
              <Icon1 />
            </button>
            {open && (
              <div className={styles.popover} ref={popoverRef}>
                <button
                  className={styles.popover__close}
                  onClick={() => setOpen(false)}
                  type="button"
                  aria-label="Закрыть"
                />
                <p className={styles.popover__text}>
                  Ознакомьтесь <br /> с{' '}
                  <Link to={infoHref} className={styles.popover__link} target="_blank" rel="noopener noreferrer">
                    рекомендациями
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {required && hint !== false && <div className={styles.file__hint}>{hint || 'Обязательно для заполнения'}</div>}
    </div>
  );
}

const MarksInput = forwardRef(function MarksInput({
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
  bordered = false,
  className,
  color = 'blue',
  buttonText = 'Загрузить изображение',
  accept,
  multiple,
  inputRef,
  hint,
  error,
  info
}, ref) {
  if (type === 'file') {
    return (
      <FileInput
        name={name}
        label={label}
        color={color}
        buttonText={buttonText}
        accept={accept}
        multiple={multiple}
        inputRef={inputRef}
        onChange={onChange}
        required={required}
        hint={hint}
        info={info}
        className={className}
      />
    );
  }

  const showMeasurement = measurement && value;
  const showCounter = maxLength != null;
  const isBordered = showCounter || bordered;
  const colorClass = styles[`input__field_${color}`] || styles.input__field_blue;

  return (
    <div className={`${styles.input} ${isBordered ? styles.input_bordered : ''} ${className || ''}`}>
      <div className={styles.input__wrapper}>
        <input
          ref={ref}
          type={type}
          className={
            `${!isBordered ? styles.input__field : ''}
            ${isBordered ? styles.input__field_bordered : ''}
            ${isBordered ? colorClass : ''}
            ${disabled ? styles.input__field_disabled : ''}
            ${error ? styles.input__field_error : ''}
            `}
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
        className={`${styles.input__label} ${isBordered ? styles.input__label_top : ''} ${disabled ? styles.input__label_disabled : ''}`}>
        {label}
      </label>
      {error && <span className={styles.input__error}>{error}</span>}
    </div>
  );
});

export default memo(MarksInput);
