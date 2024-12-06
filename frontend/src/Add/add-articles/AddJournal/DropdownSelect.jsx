import React from 'react';
import styles from './DropdownSelect.module.scss';

export default function DropdownSelect({ label, name, options, value, onChange }) {
  return (
    <div className={styles.dropdown}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={styles.select}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required>
        <option value="">Выберите...</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
