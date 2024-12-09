import React from 'react';
import styles from '../../../Add/add-project/formAdd/FormAddProject.module.scss';

export default function InputField({ label, name, value, onChange, placeholder }) {
  return (
    <div className={`${styles.form__group} ${styles.field}`}>
      <input
        id={name}
        name={name}
        className={styles.form__field}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required
      />
      <label htmlFor={name} className={styles.form__label}>
        {label}
      </label>
    </div>
  );
}
