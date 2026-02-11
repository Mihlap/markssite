import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import ReactSelect, { components } from 'react-select';
import styles from './styles.module.css';
import Icon0 from '../icon/Icon0';
import Icon1 from '../icon/Icon1';

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

function ClearIndicator(props) {
  return (
    <components.ClearIndicator {...props}>
      <Icon1 />
    </components.ClearIndicator>
  );
}

function MultiValueRemove(props) {
  return (
    <components.MultiValueRemove {...props}>
      <Icon1 />
    </components.MultiValueRemove>
  );
}

const MarksSelect = forwardRef(function Select(
  {
    options,
    value,
    onChange,
    variant = 'simple',
    placeholder = 'Выберите...',
    isDisabled = false,
    isSearchable = true,
    className,
    customStyles,
    ...rest
  },
  ref
) {
  return (
    <div className={clsx(styles.select, className, customStyles?.container)} data-variant={variant}>
      <ReactSelect
        // menuIsOpen={true}
        ref={ref}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        classNamePrefix="select"
        unstyled
        components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
        {...rest}
      />
    </div>
  );
});

export default MarksSelect;
