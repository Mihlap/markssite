import { memo } from 'react';
import Select from 'react-select';
import {
  DropdownIndicator,
  ValueContainer,
  AnotherDropdownIndicator,
  AnotherValueContainer,
  MonthDropdownIndicator,
  MonthValueContainer,
  YearDropdownIndicator,
  YearValueContainer,
} from './utils/CustomSelectComponents';
import { monthOptions, yearOptions } from './utils/Time';
import { UiMarksInput } from '../../ui/index.js';

function HeaderFields({
  styles,
  inputData,
  setInputData,
  changeHandler,
  customStyles,
  setIsFocused,
  errorMessage,
  setErrorMessage,
  selectedCompetencies,
  setSelectedCompetencies,
  selectedViewConstruction,
  setSelectedViewConstruction,
  selectedMonth,
  selectedYear,
  handleMonthChange,
  handleYearChange,
}) {
  return (
    <div className={styles.form_container__block_gray_one}>
      <UiMarksInput
        name="title"
        label="Название проекта"
        value={inputData.title}
        onChange={(event) => changeHandler(event, inputData, setInputData)}
        required
      />
      <div className={`${styles.form__group} ${styles.field}`}>
        <Select
          styles={customStyles}
          isMulti
          name="selectCompetencies"
          options={[
            { value: 'Архитектура', label: 'Архитектура' },
            { value: 'BIM', label: 'BIM' },
            { value: 'Конструктив', label: 'Конструктив' },
            { value: 'Инженерия', label: 'Инженерия' },
            { value: 'Дизайн', label: 'Дизайн' },
          ]}
          className={styles.form__field}
          placeholder="Выбрать компетенции"
          value={selectedCompetencies}
          onChange={setSelectedCompetencies}
          components={{ DropdownIndicator, ValueContainer }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      <UiMarksInput
        name="countryCity"
        label="Страна, город"
        value={inputData.countryCity}
        onChange={(event) => changeHandler(event, inputData, setInputData)}
        required
      />
      <div className={styles.form_container__time_block}>
        <div className={`${styles.form__group} ${styles.form_container__month_block}`}>
          <label htmlFor="month" className={styles.form__label}>
            Месяц
          </label>
          <Select
            id="month"
            styles={customStyles}
            className={styles.form__field}
            value={selectedMonth}
            onChange={handleMonthChange}
            options={monthOptions}
            placeholder="Месяц"
            components={{
              DropdownIndicator: MonthDropdownIndicator,
              ValueContainer: MonthValueContainer,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div className={`${styles.form__group} ${styles.form_container__year_block}`}>
          <label htmlFor="year" className={styles.form__label}>
            Год
          </label>
          <Select
            id="year"
            styles={customStyles}
            className={styles.form__field}
            value={selectedYear}
            onChange={handleYearChange}
            options={yearOptions}
            placeholder="Год"
            components={{
              DropdownIndicator: YearDropdownIndicator,
              ValueContainer: YearValueContainer,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {errorMessage && (
          <div className={styles.form_error_message}>
            <div className={styles.form_error_message_div}>
              <button
                onClick={() => setErrorMessage('')}
                className={styles.form_error_close_button}
                aria-label="Закрыть">
                ✕
              </button>
              {errorMessage}
            </div>
          </div>
        )}
      </div>
      <div className={`${styles.form__group} ${styles.field}`}>
        <Select
          styles={customStyles}
          isMulti
          name="viewConstruction"
          value={selectedViewConstruction}
          onChange={setSelectedViewConstruction}
          options={[
            {
              value: 'Архитектура и концепция',
              label: 'Архитектура и концепция',
            },
            {
              value: 'Градостроительство и генплан',
              label: 'Градостроительство и генплан',
            },
            {
              value: 'Конструктив',
              label: 'Конструктив',
            },
            {
              value: 'Инженерия',
              label: 'Инженерия',
            },
            {
              value: 'Геотехника',
              label: 'Геотехника',
            },
            {
              value: 'Наука',
              label: 'Наука',
            },
            {
              value: 'Технологии',
              label: 'Технологии',
            },
            {
              value: 'Цифровые технологии',
              label: 'Цифровые технологии',
            },
          ]}
          className={styles.form__field}
          placeholder="Выберите табы фильтрации"
          components={{
            DropdownIndicator: AnotherDropdownIndicator,
            ValueContainer: AnotherValueContainer,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
}

export default memo(HeaderFields);
