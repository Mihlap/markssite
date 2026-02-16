import { memo } from 'react';

import s from './Styles.module.css';

function MarksTextarea({
  name,
  label,
  value,
  onChange,
  placeholder,
  color = 'blue',
  error,
  btn = false,
}) {

  return (
    <div className={s.textarea__wrap}>
      <textarea
        className={`${s.textarea} ${error ? s.textarea_error : ''}`}
        name={name}
        id={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder || name}
      />
      {btn && (
        <div style={{display: 'flex', gap: '10px', order: '1'}}>
          <button style={{height: "24px", width: '24px', backgroundColor: 'red'}}>1</button>
          <button style={{height: "24px", width: '24px', backgroundColor: 'red'}}>2</button>
          <button style={{height: "24px", width: '24px', backgroundColor: 'red'}}>3</button>
        </div>
      )}
      <label htmlFor={name} className={s.textarea__label}>
        {label}
      </label>
      {error && <span className={s.textarea__error}>{error}</span>}
    </div>
  );
}

export default memo(MarksTextarea);
