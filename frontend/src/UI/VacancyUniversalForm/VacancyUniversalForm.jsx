import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { InputMask } from '@react-input/mask';
import Select from 'react-select';
import { Link } from 'react-router-dom';

const HOST = process.env.REACT_APP_SERVER_HOST;

const maskOptions = {
  mask: '+7 (___) ___-__-__',
  replacement: { _: /\d/ },
};

export const VACANCY_FORM_FIELDS = {
  detailed: [
    { name: 'name', label: 'Ваше имя и фамилия', type: 'text', required: true, column: 'left', maxLength: 100 },
    { name: 'phone', label: 'Телефон', type: 'phone', required: true, column: 'left' },
    { name: 'city', label: 'Город', type: 'text', required: false, column: 'left', maxLength: 100 },
    {
      name: 'choose',
      label: 'Выбрать направление',
      type: 'select',
      required: true,
      column: 'right',
      placeholder: 'Выбрать направление',
    },
    {
      name: 'letter',
      label: 'Сопроводительное письмо',
      type: 'text',
      required: false,
      column: 'right',
      maxLength: 500,
    },
    {
      name: 'resume',
      label: 'Ссылка на резюме/портфолио',
      type: 'text',
      required: true,
      column: 'right',
      maxLength: 200,
      allowFileFallback: true,
      withFileUpload: true,
    },
  ],
  simple: [
    { name: 'name', label: 'Ваше имя и фамилия', type: 'text', required: true, column: 'left', maxLength: 100 },
    { name: 'phone', label: 'Телефон', type: 'phone', required: true, column: 'left' },
    {
      name: 'letter',
      label: 'Сопроводительное письмо',
      type: 'text',
      required: false,
      column: 'right',
      maxLength: 500,
    },
    {
      name: 'resume',
      label: 'Ссылка на резюме/портфолио',
      type: 'text',
      required: true,
      column: 'right',
      maxLength: 200,
      allowFileFallback: true,
      withFileUpload: true,
    },
  ],
};

const DEFAULT_DIRECTION_OPTIONS = [
  { value: 'Другое направление', label: 'Другое направление' },
  { value: 'Архитектура', label: 'Архитектура' },
  { value: 'Конструктив', label: 'Конструктив' },
  { value: 'Инженерия', label: 'Инженерия' },
  { value: 'Научно-техническое сопровождение', label: 'Научно-техническое сопровождение' },
  { value: 'BIM', label: 'BIM' },
  { value: 'Аналитика', label: 'Аналитика' },
  { value: 'Финансы', label: 'Финансы' },
  { value: 'Дизайн', label: 'Дизайн' },
  { value: 'IT', label: 'IT' },
  { value: 'Администрирование', label: 'Администрирование' },
  { value: 'Бэк офис', label: 'Бэк офис' },
  { value: 'Стажировки', label: 'Стажировки' },
  { value: 'Управление', label: 'Управление' },
];

const defaultSelectStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
  control: (provided, state) => ({
    ...provided,
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: state.isFocused ? 'none' : provided.boxShadow,
    borderBottom: state.isFocused ? '1px solid #75BBFD' : '1px solid #959DA6',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : undefined,
    transition: 'transform 0.3s ease-in-out',
    color: state.isFocused ? '#75BBFD' : '#C0C5CB',
  }),
  menu: (provided) => ({
    ...provided,
    boxShadow: 'none',
    backgroundColor: '#EBECEE',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#75BBFD' : 'transparent',
    color: state.isFocused ? '#fff' : 'inherit',
  }),
};

const getFieldMap = (fields) =>
  fields.reduce(
    (acc, field) => {
      acc.focus[field.name] = false;
      if (field.type === 'phone') {
        acc.phone[field.name] = true;
      }
      return acc;
    },
    { focus: {}, phone: {} }
  );

const buildFormData = (fields, initialValues, vacancyTitle) =>
  fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: initialValues[field.name] ?? '',
    }),
    {
      title: vacancyTitle ?? initialValues.title ?? '',
    }
  );

const buildSelectValues = (fields, initialValues, optionsSet) => {
  const selectState = {};

  fields
    .filter((field) => field.type === 'select')
    .forEach((field) => {
      const options = field.options ?? optionsSet;
      const currentValue = initialValues[field.name];
      if (currentValue) {
        selectState[field.name] = options.find((option) => option.value === currentValue) ?? null;
      } else {
        selectState[field.name] = null;
      }
    });

  return selectState;
};

const VacancyUniversalForm = ({
  variant = 'detailed',
  fieldsConfig,
  directionOptions = DEFAULT_DIRECTION_OPTIONS,
  initialValues = {},
  vacancyTitle,
  submitUrl,
  host = HOST,
  metricGoal,
  attachmentsLimit = 2,
  buttonText = 'Откликнуться на вакансию',
  centerButton = false,
  buttonAlignment = 'left',
  policyPrefix = 'Нажав на кнопку, соглашаюсь на обработку',
  policyLinkText = 'персональных данных',
  policyLink = '../Information',
  handleMouseEnter,
  handleMouseLeave,
  renderLoader,
  onSubmitStart,
  onSubmitSuccess,
  onSubmitError,
  onLoadingChange,
  className = '',
  formRef,
  contactsBlock,
  selectStyles = defaultSelectStyles,
  buttonProps = {},
}) => {
  const resolvedFields = useMemo(() => {
    if (fieldsConfig?.length) {
      return fieldsConfig;
    }
    return VACANCY_FORM_FIELDS[variant] ?? VACANCY_FORM_FIELDS.detailed;
  }, [fieldsConfig, variant]);

  const formDefaults = useMemo(
    () => buildFormData(resolvedFields, initialValues, vacancyTitle),
    [resolvedFields, initialValues, vacancyTitle]
  );
  const selectDefaults = useMemo(
    () => buildSelectValues(resolvedFields, { ...initialValues, ...formDefaults }, directionOptions),
    [resolvedFields, initialValues, formDefaults, directionOptions]
  );

  const { focus: focusDefaults, phone: phoneDefaults } = useMemo(() => getFieldMap(resolvedFields), [resolvedFields]);

  const [formData, setFormData] = useState(formDefaults);
  const [isFocused, setIsFocused] = useState(focusDefaults);
  const [phoneValidity, setPhoneValidity] = useState(phoneDefaults);
  const [selectValues, setSelectValues] = useState(selectDefaults);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMetricSent, setIsMetricSent] = useState(false);

  const fileInputRef = useRef(null);
  useEffect(() => {
    setFormData(formDefaults);
  }, [formDefaults]);

  useEffect(() => {
    setIsFocused(focusDefaults);
    setPhoneValidity(phoneDefaults);
  }, [focusDefaults, phoneDefaults]);

  useEffect(() => {
    setSelectValues(selectDefaults);
  }, [selectDefaults]);

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  const isFilled = useCallback((name) => !!formData[name], [formData]);

  const validateField = useCallback(
    (field) => {
      if (!field.required) return false;

      const rawValue = (formData[field.name] ?? '').trim();

      if (field.type === 'select') {
        return rawValue === '';
      }

      if (field.type === 'phone') {
        return rawValue === '' || !phoneValidity[field.name];
      }

      if (field.allowFileFallback) {
        return rawValue === '' && selectedFiles.length === 0;
      }

      return rawValue === '';
    },
    [formData, phoneValidity, selectedFiles.length]
  );

  useEffect(() => {
    const nextErrors = resolvedFields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: validateField(field),
      }),
      {}
    );

    const hasErrors = Object.values(nextErrors).some(Boolean);
    const phonesValid = Object.values(phoneValidity).every(Boolean);
    setErrors(nextErrors);
    setIsFormValid(!hasErrors && phonesValid);
  }, [resolvedFields, validateField, phoneValidity]);

  const handleFocus = useCallback(
    (event, field) => {
      const name = event?.target?.name ?? field?.name;
      setIsFocused((prev) => ({ ...prev, [name]: true }));

      if (field?.type === 'phone' && !formData[name]) {
        setFormData((prev) => ({ ...prev, [name]: maskOptions.mask }));
      }
    },
    [formData]
  );

  const handleBlur = useCallback(
    (event, field) => {
      const name = event?.target?.name ?? field?.name;
      setIsFocused((prev) => ({ ...prev, [name]: false }));

      if (field?.type === 'phone') {
        const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        const value = formData[name];

        if (value === maskOptions.mask) {
          setFormData((prev) => ({ ...prev, [name]: '' }));
        }

        setPhoneValidity((prev) => ({
          ...prev,
          [name]: phoneNumberRegex.test(value),
        }));
      }
    },
    [formData]
  );

  const handlePaste = useCallback(
    (event) => {
      event.preventDefault();
      const fieldName = event.target?.name;
      if (!fieldName) return;

      const pastedData = event.clipboardData.getData('text');
      const cleanedValue = pastedData.replace(/\D/g, '');

      if (cleanedValue.length >= 10) {
        const formattedValue = `+7 (${cleanedValue.slice(-10, -7)}) ${cleanedValue.slice(-7, -4)}-${cleanedValue.slice(
          -4,
          -2
        )}-${cleanedValue.slice(-2)}`;
        setFormData((prevData) => ({ ...prevData, [fieldName]: formattedValue }));
        setPhoneValidity((prev) => ({ ...prev, [fieldName]: true }));
      } else {
        setPhoneValidity((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    [phoneValidity]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (phoneValidity[name] !== undefined && value) {
      setPhoneValidity((prev) => ({ ...prev, [name]: true }));
    }
  }, [phoneValidity]);

  const handleSelectChange = useCallback((fieldName, selectedOption) => {
    setSelectValues((prev) => ({ ...prev, [fieldName]: selectedOption }));
    setFormData((prev) => ({ ...prev, [fieldName]: selectedOption?.value ?? '' }));
  }, []);

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const accepted = files.every(
      (file) => file.type.includes('image/') || file.type === 'application/pdf' || file.type.includes('application/')
    );

    if (!accepted) {
      console.error('Invalid file type. Please select an image, PDF, or other document.');
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setSelectedFiles((prevFiles) => {
      const updated = [...prevFiles];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const resolvedSubmitUrl = submitUrl ?? `${host}/api-mail/portalSubmitForm`;
  const resolvedMetricGoal = metricGoal ?? (variant === 'simple' ? 'form2_done' : 'form1_done');

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (isMetricSent) return;
      setIsMetricSent(true);

      const validationResult = resolvedFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: validateField(field),
        }),
        {}
      );

      const hasErrors = Object.values(validationResult).some(Boolean);
      if (hasErrors) {
        setErrors(validationResult);
        setIsMetricSent(false);
        return;
      }

      const phonesValid = Object.values(phoneValidity).every(Boolean);
      if (!phonesValid) {
        setIsMetricSent(false);
        return;
      }

      setIsSubmitting(true);
      onSubmitStart?.();

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          formDataToSend.append(key, value);
        }
      });

      selectedFiles.forEach((file) => {
        formDataToSend.append('resumeFiles', file);
      });

      fetch(resolvedSubmitUrl, {
        method: 'POST',
        body: formDataToSend,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.message === 'Письмо успешно отправлено') {
            setFormData(formDefaults);
            setSelectValues(selectDefaults);
            setSelectedFiles([]);
            setErrors({});
            onSubmitSuccess?.(data);
            if (typeof window !== 'undefined' && window?.ym) {
              window.ym(95967240, 'reachGoal', resolvedMetricGoal);
            }
          } else {
            console.error('Form submission failed:', data?.message ?? 'Unknown error');
            onSubmitError?.(data);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          onSubmitError?.(error);
        })
        .finally(() => {
          setIsSubmitting(false);
          setIsMetricSent(false);
        });
    },
    [
      formData,
      resolvedFields,
      validateField,
      phoneValidity,
      selectedFiles,
      resolvedSubmitUrl,
      formDefaults,
      selectDefaults,
      resolvedMetricGoal,
      onSubmitStart,
      onSubmitSuccess,
      onSubmitError,
      isMetricSent,
    ]
  );

  const renderInput = (field) => {
    const commonProps = {
      name: field.name,
      value: formData[field.name] ?? '',
      placeholder: '',
      maxLength: field.maxLength,
      autoComplete: 'off',
      onChange: handleChange,
      onFocus: (event) => handleFocus(event, field),
      onBlur: (event) => handleBlur(event, field),
      onMouseOver: handleMouseEnter,
      onMouseOut: handleMouseLeave,
      className: `vacancy-form__input vacancy-form__input--${field.name}`,
    };

    if (field.type === 'phone') {
      return (
        <InputMask
          {...commonProps}
          mask={maskOptions.mask}
          replacement={maskOptions.replacement}
          showMask
          onPaste={handlePaste}
          style={{ fontVariantNumeric: 'lining-nums' }}
        />
      );
    }

    if (field.type === 'select') {
      const hasError = errors[field.name];
      return (
        <Select
          classNamePrefix="vacancy-form-select"
          name={field.name}
          options={field.options ?? directionOptions}
          value={selectValues[field.name]}
          placeholder={field.placeholder ?? field.label}
          onChange={(option) => handleSelectChange(field.name, option)}
          isClearable
          isSearchable={false}
          styles={{
            ...selectStyles,
            control: (provided, state) => ({
              ...defaultSelectStyles.control(provided, state),
              ...(selectStyles.control ? selectStyles.control(provided, state) : {}),
              borderBottom: hasError ? '1px solid #E00747' : defaultSelectStyles.control(provided, state).borderBottom,
            }),
          }}
        />
      );
    }

    return <input type="text" {...commonProps} />;
  };

  if (isSubmitting && renderLoader) {
    return <div className={`vacancy-form ${className}`}>{renderLoader}</div>;
  }

  return (
    <form ref={formRef} className={`vacancy-form ${className}`} onSubmit={handleSubmit}>
      <div className="vacancy-form__grid">
        {['left', 'right'].map((column) => (
          <div className={`vacancy-form__column vacancy-form__column--${column}`} key={column}>
            {resolvedFields
              .filter((field) => (field.column ?? 'left') === column)
              .map((field) => (
                <div className="vacancy-form__field" key={field.name}>
                  <label
                    className={`vacancy-form__label ${
                      isFocused[field.name] || isFilled(field.name) ? 'vacancy-form__label--focused' : ''
                    }`}
                    onMouseOver={handleMouseEnter}
                    onMouseOut={handleMouseLeave}>
                    {renderInput(field)}
                    <span className="vacancy-form__placeholder">{field.label}</span>
                    <div
                      className={`vacancy-form__underline ${
                        errors[field.name] ? 'vacancy-form__underline--error' : ''
                      }`}
                    />
                    {field.type === 'phone' && !phoneValidity[field.name] && formData[field.name]?.length > 0 && (
                      <span className="vacancy-form__error-text">Некорректный телефон</span>
                    )}
                  </label>
                  {field.withFileUpload && (
                    <>
                      <div className="vacancy-form__files">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={file.name + index}
                            className="vacancy-form__file"
                            onMouseOver={handleMouseEnter}
                            onMouseOut={handleMouseLeave}
                            onClick={() => handleRemoveFile(index)}>
                            <span className="vacancy-form__file-remove">&times;</span>
                            <span className="vacancy-form__file-name">{file.name}</span>
                          </div>
                        ))}
                      </div>
                      {selectedFiles.length < attachmentsLimit && (
                        <>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            multiple={false}
                          />
                          <button
                            type="button"
                            className="vacancy-form__file-button"
                            onMouseOver={handleMouseEnter}
                            onMouseOut={handleMouseLeave}
                            onClick={() => fileInputRef.current?.click()}>
                            Прикрепить файл
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div
        className={`vacancy-form__actions vacancy-form__actions--${buttonAlignment} ${
          centerButton ? 'vacancy-form__actions--center' : ''
        }`}>
        <div className="vacancy-form__agreement">
          {policyPrefix}{' '}
          <Link to={policyLink} target="_blank" rel="noreferrer" className="vacancy-form__agreement-link">
            {policyLinkText}
          </Link>
        </div>
        <button
          type="submit"
          className={`vacancy-form__submit ${!isFormValid ? 'vacancy-form__submit--disabled' : ''}`}
          disabled={!isFormValid}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...buttonProps}>
          <span>{buttonText}</span>
        </button>
      </div>
      {contactsBlock && <div className="vacancy-form__contacts">{contactsBlock}</div>}
    </form>
  );
};

VacancyUniversalForm.propTypes = {
  variant: PropTypes.oneOf(['detailed', 'simple']),
  fieldsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'phone', 'select']).isRequired,
      required: PropTypes.bool,
      column: PropTypes.oneOf(['left', 'right']),
      maxLength: PropTypes.number,
      placeholder: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      allowFileFallback: PropTypes.bool,
      withFileUpload: PropTypes.bool,
    })
  ),
  directionOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  initialValues: PropTypes.object,
  vacancyTitle: PropTypes.string,
  submitUrl: PropTypes.string,
  host: PropTypes.string,
  metricGoal: PropTypes.string,
  attachmentsLimit: PropTypes.number,
  buttonText: PropTypes.string,
  centerButton: PropTypes.bool,
  buttonAlignment: PropTypes.oneOf(['left', 'right', 'center']),
  policyPrefix: PropTypes.string,
  policyLinkText: PropTypes.string,
  policyLink: PropTypes.string,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  renderLoader: PropTypes.node,
  onSubmitStart: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  onSubmitError: PropTypes.func,
  onLoadingChange: PropTypes.func,
  className: PropTypes.string,
  formRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
  contactsBlock: PropTypes.node,
  selectStyles: PropTypes.object,
  buttonProps: PropTypes.object,
};

export default VacancyUniversalForm;
