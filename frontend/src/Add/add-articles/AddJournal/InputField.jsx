import React from 'react';
import styles from '../../../Add/add-project/formAdd/FormAddProject.module.scss';

export default function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  wrapperClassName,
  inputClassName,
  useHeadingBlock,
}) {
  return useHeadingBlock ? (
    <div className={`${styles.form_container__heading_block} ${wrapperClassName || ''}`}>
      <label htmlFor={name} className={styles.input_field__label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`${styles.form_container__heading_block_input} ${inputClassName || ''}`}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required
      />     
    </div>
  ) : (
    <div className={`${styles.form__group} ${styles.field} ${wrapperClassName || ''}`}>
      <input
        id={name}
        name={name}
        className={`${styles.form__field} ${inputClassName || ''}`}
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
