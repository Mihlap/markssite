import clsx from 'clsx';
import ReactSelect from 'react-select';
import styles from './styles.module.css';

export default function Select({
  options,
  value,
  onChange,
  variant = 'simple',
  placeholder = 'Выберите...',
  isDisabled = false,
  isSearchable = true,
  className,
  ...rest
}) {
  return (
    <div className={clsx(styles.select, className)} data-variant={variant}>
      <ReactSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        classNamePrefix="select"
        {...rest}
      />
    </div>
  );
}
