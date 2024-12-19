import React, { memo } from 'react';
import styles from '../../../Add/add-project/formAdd/FormAddProject.module.scss';

function InputField({
  label,
  name,
  value = '',
  onChange,
  placeholder,
  wrapperClassName,
  inputClassName,
  type = 'text',
  useHeadingBlock = false,
}) {
  return useHeadingBlock ? (
    <div className={`${styles.form_container__heading_block} ${wrapperClassName || ''}`}>
      {label && (
        <label htmlFor={name} className={styles.input_field__label}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`${styles.form_container__heading_block_input} ${inputClassName || ''}`}
        type={type}
        value={value || ''}
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
        type={type}
        value={value || ''}
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

export default memo(InputField);
