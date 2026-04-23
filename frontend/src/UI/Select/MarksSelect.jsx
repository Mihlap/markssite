import { forwardRef, useRef, useEffect } from 'react';
import clsx from 'clsx';
import ReactSelect, { components } from 'react-select';
import styles from './styles.module.css';
import Icon0 from '../icon/Icon0';
// import Icon1 from '../icon/Icon1';

function DropdownIndicator(props) {
  const { isFocused } = props;

  let color;
  if (isFocused) color = 'var(--blue-75BBFD)';
  else color = 'var(--gray-959DA6)';

  return (
    <components.DropdownIndicator
      {...props}
      innerProps={{
        ...props.innerProps,
      }}
    >
      <Icon0 color={color} />
    </components.DropdownIndicator>
  );
}


function MultiValueRemove(props) {
  return (
    <components.MultiValueRemove {...props}>
      {/* <Icon1 /> */}
    </components.MultiValueRemove>
  );
}


const MarksSelect = forwardRef(function Select(
  {
    options,
    value,
    name,
    label,
    onChange,
    variant = 'simple',
    placeholder = 'Выберите...',
    isDisabled = false,
    isSearchable = true,
    className,
    customStyles,
    error,
    middle = false,
    wheelSelect = false,
    ...rest
  },
  ref
) {
  const hasValue = Array.isArray(value) ? value.length > 0 : value != null;

  return (
    <div
      className={clsx(styles.select, className, customStyles?.container, error && styles.select_error)}
      data-variant={variant}
      data-wheel-select={wheelSelect || undefined}>
      {label && (
        <label htmlFor={name} className={clsx(styles.floatingLabel, hasValue && styles.floatingLabel_up)}>
          {label}
        </label>
      )}
      <ReactSelect
        inputId={name}
        ref={ref}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={label ? '' : placeholder}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        classNamePrefix="select"
        unstyled
        components={{
          DropdownIndicator,
          MultiValueRemove,
        }}
        isClearable={false}
        {...rest}
        middle={middle}
        wheelSelect={wheelSelect}
        {...(wheelSelect ? { closeMenuOnSelect: false } : {})}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

export default MarksSelect;
