import React from 'react';
import styles from './InputField.module.scss';

export default function InputField({ label, name, value, onChange }) {
  return (
    <div className={styles.inputField}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required
      />
    </div>
  );
}
