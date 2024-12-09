import React from 'react';
import Select from 'react-select';
// import styles from './DropdownSelect.module.scss';
import styles from '../../../Add/add-project/formAdd/FormAddProject.module.scss';
import customStyles from '../../add-project/formAdd/utils/customStyles';



export default function DropdownSelect({
  label,
  name,
  options,
  value,
  onChange,
  isMulti,
  placeholder,
  components,
  onFocus,
  onBlur,
}) {
  return (
    <div className={`${styles.form__group} ${styles.field}`}>
      {label && (
        <label htmlFor={name} className={styles.form__label}>
          {label}
        </label>
      )}
      <Select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
        placeholder={placeholder}
        components={components}
        styles={customStyles}
        onFocus={onFocus}
        onBlur={onBlur}
        className={styles.form__field}     
      />
    </div>
  );
}
