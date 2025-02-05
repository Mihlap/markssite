import React from 'react';
import Select from 'react-select';
import styles from './DropdownSelect.module.scss';
import { customsStyles } from './utils/customsStyles';


export default function DropdownSelect({
  name,
  options,
  value,
  onChange,
  isMulti,
  placeholder,  
  onFocus,
  onBlur,
}) {
  return (
    <div className={styles.form__group}>   
      <Select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
        placeholder={placeholder}        
        styles={customsStyles}
        onFocus={onFocus}
        onBlur={onBlur}        
      />
    </div>
  );
}
