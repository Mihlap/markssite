import clsx from 'clsx';
import ReactSelect from 'react-select';
import styles from './styles.module.css';

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  isDisabled = false,
  isSearchable = true,
  className,
  ...rest
}) {
  return (
    <ReactSelect
      // menuIsOpen={true} // keeps menu always open
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      className={clsx(styles.select, className)}
      classNamePrefix="select"
      {...rest}
    />
  );
}
