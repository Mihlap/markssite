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

function CustomMenuList(props) {
  const { middle, wheelSelect, options, value, onChange } = props.selectProps;
  const containerRef = useRef(null);
  const stableRef = useRef(null);
  stableRef.current = { options, value, onChange };

  useEffect(() => {
    if (!middle) return;
    const container = containerRef.current;
    if (!container) return;
    const selected = container.querySelector('.select__option--is-selected');
    if (!selected) return;
    container.scrollTop = selected.offsetTop - container.offsetHeight / 2 + selected.offsetHeight / 2;
  }, [middle]);

  useEffect(() => {
    if (!wheelSelect) return;
    const container = containerRef.current;
    if (!container) return;

    let lastWheel = 0;

    const handleWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < 150) return;
      lastWheel = now;

      const { options: opts, value: val, onChange: change } = stableRef.current;
      const currentIndex = opts.findIndex((opt) => opt.value === val?.value);
      const newIndex =
        e.deltaY > 0
          ? Math.min(currentIndex + 1, opts.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (newIndex === currentIndex) return;
      change(opts[newIndex]);

      requestAnimationFrame(() => {
        const c = containerRef.current;
        if (!c) return;
        const selected = c.querySelector('.select__option--is-selected');
        if (!selected) return;
        c.scrollTop = selected.offsetTop - c.offsetHeight / 2 + selected.offsetHeight / 2;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [wheelSelect]);

  function setRef(node) {
    containerRef.current = node;
    const { innerRef } = props;
    if (typeof innerRef === 'function') innerRef(node);
    else if (innerRef && 'current' in innerRef) innerRef.current = node;
  }

  return <components.MenuList {...props} innerRef={setRef} />;
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
        <label
          htmlFor={name}
          className={clsx(styles.floatingLabel, hasValue && styles.floatingLabel_up)}>
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
        // components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
        components={{ DropdownIndicator, MultiValueRemove, ...((middle || wheelSelect) ? { MenuList: CustomMenuList } : {}) }}
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
