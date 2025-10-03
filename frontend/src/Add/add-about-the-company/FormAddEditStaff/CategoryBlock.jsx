import { useMemo, memo, useEffect, useRef, useState, useCallback } from 'react';
import Select, { components } from 'react-select';
import customStyles from '../../add-hr-portal/FormAddEditVacancy/customStyle';

const CATEGORY_OPTIONS = [
  { value: 'Руководство', label: 'Руководство' },
  { value: 'Научное сопровождение', label: 'Научное сопровождение' },
  { value: 'HR', label: 'HR' },
];

export default memo(function CategoryBlock({
  styles,
  inputData,
  setInputData,
  setIsFocused,
  currentCategory,
  isEditing = false,
}) {
  const [hasFocus, setHasFocus] = useState(false);
  const [pointerInsideMenu, setPointerInsideMenu] = useState(false);
  const [hasKeyboardNav, setHasKeyboardNav] = useState(false);
  const outerRef = useRef(null);
  const selectApiRef = useRef(null);
  const timerRef = useRef(null);

  const value = useMemo(() => {
    const curArr = Array.isArray(inputData?.category) ? inputData.category : [];
    if (curArr.length > 0) {
      return curArr
        .map((v) => (typeof v === 'string' ? CATEGORY_OPTIONS.find((o) => o.value === v) : null))
        .filter(Boolean);
    }
    if (currentCategory) {
      const categoryOption = CATEGORY_OPTIONS.find((o) => o.value === currentCategory);
      return categoryOption ? [categoryOption] : [];
    }
    return [];
  }, [inputData?.category, currentCategory]);

  useEffect(() => {
    if (!isEditing && currentCategory && (!inputData.category || inputData.category.length === 0)) {
      setInputData((p) => ({ ...p, category: [currentCategory] }));
    }
  }, [currentCategory, isEditing, inputData.category, setInputData]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const commitBlurIfOutside = (delay = 0) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const active = document.activeElement;
      const inside = outerRef.current?.contains(active);
      if (!inside) {
        try {
          selectApiRef.current?.blur?.();
        } catch (e) {    
        }
        setHasFocus(false);
        setIsFocused?.(false);
      }
    }, delay);
  };

  const handleChange = (selected) => {
    const vals = Array.isArray(selected) ? selected.map((s) => s.value) : [];
    setInputData((p) => ({ ...p, category: vals }));
    commitBlurIfOutside(10);
  };

  const isOptionDisabled = (option) => {
    if (!isEditing && currentCategory && option.value === currentCategory) return true;
    return false;
  };

  const MultiValueRemove = (props) => {
    const isDefault = props?.data?.value === currentCategory && !isEditing;
    if (isDefault) return null;
    return <components.MultiValueRemove {...props} />;
  };

  const MenuListWrapper = (props) => {
    const { innerRef, innerProps } = props;
    const onMouseEnter = (e) => {
      setPointerInsideMenu(true);
      innerProps?.onMouseEnter?.(e);
    };
    const onMouseLeave = (e) => {
      setPointerInsideMenu(false);
      innerProps?.onMouseLeave?.(e);
    };
    return (
      <components.MenuList
        {...props}
        innerProps={{
          ...innerProps,
          onMouseEnter,
          onMouseLeave,
        }}
        innerRef={innerRef}
      />
    );
  };
 
  const InteractiveOption = (props) => {
    const { innerProps = {} } = props;
    const onMouseEnter = (e) => {
      setPointerInsideMenu(true);
      innerProps.onMouseEnter?.(e);
    };
    const onMouseLeave = (e) => {   
      innerProps.onMouseLeave?.(e);
    };
    return (
      <components.Option
        {...props}
        innerProps={{
          ...innerProps,
          onMouseEnter,
          onMouseLeave,
        }}
      />
    );
  };
 
  const mergedStyles = {
    ...customStyles,
    control: (base, state) => {
      const fromCustom = typeof customStyles.control === 'function' ? customStyles.control(base, state) : base;
      const borderColor = hasFocus ? '#75BBFD' : '#959DA6';
      return {
        ...fromCustom,
        border: 'none',
        borderBottom: `1px solid ${borderColor}`,
        borderRadius: 0,
        boxShadow: 'none',
        outline: 'none',
        transition: 'border-color 120ms ease',
        '&:hover': {
          borderBottom: `1px solid ${borderColor}`,
        },
      };
    },

    multiValue: (base, state) => {
      const baseFromCustom =
        typeof customStyles.multiValue === 'function' ? customStyles.multiValue(base, state) : base;
      return {
        ...baseFromCustom,
        marginRight: 11,
        cursor: state?.data?.value === currentCategory && !isEditing ? 'default' : 'pointer',
      };
    },

    multiValueLabel: (base, state) => {
      const baseFromCustom =
        typeof customStyles.multiValueLabel === 'function' ? customStyles.multiValueLabel(base, state) : base;
      const isDefault = state?.data?.value === currentCategory && !isEditing;
      return {
        ...baseFromCustom,
        color: isDefault ? '#75BBFD' : baseFromCustom.color,
        cursor: isDefault ? 'default' : 'pointer',
      };
    },

    multiValueRemove: (base, state) => {
      const baseFromCustom =
        typeof customStyles.multiValueRemove === 'function' ? customStyles.multiValueRemove(base, state) : base;
      const isDefault = state?.data?.value === currentCategory && !isEditing;
      return {
        ...baseFromCustom,
        marginLeft: 0,
        cursor: isDefault ? 'default' : 'pointer',
      };
    },

    dropdownIndicator: (base, state) => {
      const baseFromCustom =
        typeof customStyles.dropdownIndicator === 'function' ? customStyles.dropdownIndicator(base, state) : base;
      return { ...baseFromCustom, cursor: 'pointer' };
    },

    option: (base, { isFocused, isSelected }) => {
      const hoverBg = 'var(--light-blue-D4EDFB)';   
      const showBg = isFocused && (pointerInsideMenu || hasKeyboardNav);
      const background = showBg ? hoverBg : 'transparent';
      const color = 'var(--dark-gray-566272)';
      return {
        ...base,
        background,
        color,
        cursor: isSelected && !isFocused ? 'default' : 'pointer',
        ':active': {
          background: showBg ? hoverBg : 'transparent',
        },
      };
    },
  };

  const InlineDropdownIndicator = (props) => {
    const inner = props.innerProps || {};
    const onMouseDown = (e) => {
      inner.onMouseDown?.(e);
      setHasFocus(true);
      setIsFocused?.(true);
    };
    return <components.DropdownIndicator {...props} innerProps={{ ...inner, onMouseDown }} />;
  };

  const InlineValueContainer = (props) => (
    <components.ValueContainer {...props}>{props.children}</components.ValueContainer>
  );

  const handleFocus = () => {
    setHasFocus(true);
    setIsFocused?.(true);
  };

  const handleBlur = () => {
    commitBlurIfOutside(0);
  };

  const handleMenuOpen = () => {
    setHasFocus(true);
    setIsFocused?.(true);
    setPointerInsideMenu(false);
    setHasKeyboardNav(false);
  };

  const handleMenuClose = () => {
    commitBlurIfOutside(0);
    setPointerInsideMenu(false);
    setHasKeyboardNav(false);
  };

  const handleKeyDown = useCallback(
    (e) => {
      const keysThatIndicateNavigation = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
      if (keysThatIndicateNavigation.includes(e.key)) {
        setHasKeyboardNav(true);
      }
    },
    [setHasKeyboardNav]
  );

  return (
    <div className={styles.form_container__block_gray_one} style={{ paddingTop: 0, marginBottom: 0 }} ref={outerRef}>
      <div className={styles.form_container__checkbox_block} style={{ marginTop: 14, marginBottom: 0 }}>
        <div className={styles.form_container__heading_block_label} style={{ marginBottom: '-6px', paddingBottom: 0 }}>
          Категория
        </div>
      </div>

      <div className={`${styles.form__group} ${styles.field}`} style={{ marginTop: 0, paddingTop: 0 }}>
        <Select
          ref={selectApiRef}
          styles={mergedStyles}
          isMulti
          isClearable={false}
          isSearchable={false}
          name="category"
          options={CATEGORY_OPTIONS}
          className={styles.form__field}
          value={value}
          onChange={handleChange}
          isOptionDisabled={isOptionDisabled}
          components={{
            DropdownIndicator: InlineDropdownIndicator,
            ValueContainer: InlineValueContainer,
            MultiValueRemove,
            ClearIndicator: () => null,
            Option: InteractiveOption,
            MenuList: MenuListWrapper,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          onKeyDown={handleKeyDown}
          placeholder={value.length > 0 ? '' : 'Выберите категорию'}
          closeMenuOnSelect={true}
          blurInputOnSelect={false}
        />
      </div>
    </div>
  );
});
