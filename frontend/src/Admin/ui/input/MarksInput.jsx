import { memo, forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ClipIcon, Icon1 } from '../index.js';

import styles from './Styles.module.css';

const DISALLOWED_TYPES = ['image/webp'];

function validateFiles(files) {
  for (const file of files) {
    if (DISALLOWED_TYPES.includes(file.type)) {
      return `Формат ${file.type} не поддерживается. Используйте JPEG, PNG.`;
    }
  }
  return null;
}

function FileInput({ name, label, color = 'blue', buttonText = 'Загрузить изображение', accept, multiple, inputRef, onChange, required, hint, info, className }) {
  const [open, setOpen] = useState(false);
  const [formatError, setFormatError] = useState(null);
  const popoverRef = useRef(null);
  const wrapperRef = useRef(null);
  const colorClass = styles[`file__button_${color}`] || styles.file__button_blue;
  const infoHref = typeof info === 'string' ? info : '#';

  function handleChange(e) {
    const files = Array.from(e.target.files || []);
    const error = validateFiles(files);
    if (error) {
      setFormatError(error);
      e.target.value = '';
      return;
    }
    setFormatError(null);
    onChange?.(e);
  }

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
          <input type="file" name={name} accept={accept} multiple={multiple} ref={inputRef} onChange={handleChange} />
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
      {formatError && <div className={styles.file__hint}>{formatError}</div>}
      {!formatError && required && hint !== false && <div className={styles.file__hint}>{hint || 'Обязательно для заполнения'}</div>}
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
  autoGrow = false,
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
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!autoGrow) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [autoGrow, value]);

  const blockEnter = useCallback((e) => {
    if (e.key === 'Enter') e.preventDefault();
  }, []);

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
  const isBordered = showCounter || bordered || autoGrow;
  const colorClass = styles[`input__field_${color}`] || styles.input__field_blue;

  const fieldClass = [
    isBordered ? styles.input__field_bordered : styles.input__field,
    isBordered ? colorClass : '',
    autoGrow ? styles.input__field_autogrow : '',
    disabled ? styles.input__field_disabled : '',
    error ? styles.input__field_error : '',
  ].join(' ');

  return (
    <div className={`${!isBordered ? styles.input : ''} ${isBordered ? styles.input_bordered : ''} ${className || ''}`}>
      {label && (
        <label
          htmlFor={name}
          className={`${styles.input__label} ${isBordered ? styles.input__label_top : ''} ${disabled ? styles.input__label_disabled : ''}`}>
          {label}
        </label>
      )}
      <div className={styles.input__wrapper}>
        {autoGrow ? (
          <textarea
            ref={textareaRef}
            className={fieldClass}
            placeholder={placeholder || name}
            name={name}
            id={name}
            value={value ?? ''}
            onChange={onChange}
            onKeyDown={blockEnter}
            required={required}
            disabled={disabled}
            rows={1}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            className={fieldClass}
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
        )}
        {showMeasurement && <span className={styles.input__measurement}>{measurement}</span>}
        {showCounter && <div className={styles.input__counter}>{`${(value || '').length}/${maxLength}`}</div>}
      </div>
      {error && <span className={styles.input__error}>{error}</span>}
    </div>
  );
});

export default memo(MarksInput);
