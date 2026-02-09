import { memo } from 'react';
import Select from 'react-select';
import { AnotherDropdownIndicator, AnotherValueContainer, AnotherStagesProject } from './utils/CustomSelectComponents';
import { UiMarksInput } from '../../ui/index.js';

function LocationStagesBlock({
  styles,
  inputData,
  setInputData,
  customStyles,
  setIsFocused,
  changeHandler,
  selectedDegreeParticipation,
  setSelectedDegreeParticipation,
  selectStatusObject,
  setSelectStatusObject,
  selectedProjectStages,
  setSelectedProjectStages,
}) {
  return (
    <div className={styles.measure_location_container}>
      <div className={`${styles.form_container__block_gray_one} ${styles.form_container__three_grey_block}`}>
        <UiMarksInput
          name="location"
          label="Расположение: Город, улица, номер дома"
          value={inputData.location}
          onChange={(event) => changeHandler(event, inputData, setInputData)}
        />
        <div className={`${styles.form__group} ${styles.field}`}>
          <Select
            styles={customStyles}
            isMulti
            name="degreeParticipation"
            value={selectedDegreeParticipation || []}
            onChange={setSelectedDegreeParticipation}
            options={[
              {
                value: 'Генеральное проектирование',
                label: 'Генеральное проектирование',
              },
              {
                value: 'Проектирование отдельных разделов',
                label: 'Проектирование отдельных разделов',
              },
              {
                value: 'Адаптация зарубежной концепции',
                label: 'Адаптация зарубежной концепции',
              },
            ]}
            className={styles.form__field}
            placeholder="Степень участия"
            components={{
              DropdownIndicator: AnotherDropdownIndicator,
              ValueContainer: AnotherValueContainer,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <Select
            styles={customStyles}
            name="statusObject"
            options={[
              {
                value: 'Завершен',
                label: 'Завершен',
              },
              {
                value: 'В работе',
                label: 'В работе',
              },
            ]}
            className={styles.form__field}
            placeholder="Статус объекта"
            value={selectStatusObject ?? null}
            onChange={setSelectStatusObject}
            components={{
              DropdownIndicator: AnotherDropdownIndicator,
              ValueContainer: AnotherStagesProject,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <UiMarksInput
          name="customer"
          label="Заказчик"
          value={inputData.customer}
          onChange={(event) => changeHandler(event, inputData, setInputData)}
        />

        <div className={styles.form_container__block_gray_flex}>
          <div className={styles.form_container__block_public}>
            <UiMarksInput
              name="publication"
              label="Публикация"
              value={inputData.publication}
              onChange={(event) => changeHandler(event, inputData, setInputData)}
            />
            <UiMarksInput
              name="publicationTwo"
              label="Публикация"
              value={inputData.publicationTwo}
              onChange={(event) => changeHandler(event, inputData, setInputData)}
            />
          </div>
          <div className={styles.form_container__block_public_link}>
            <UiMarksInput
              name="linkToPublication"
              label="Ссылк на статью"
              value={inputData.linkToPublication}
              onChange={(event) => changeHandler(event, inputData, setInputData)}
            />
            <UiMarksInput
              name="linkToPublicationTwo"
              label="Ссылк на статью"
              value={inputData.linkToPublicationTwo}
              onChange={(event) => changeHandler(event, inputData, setInputData)}
            />
          </div>
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <Select
            styles={customStyles}
            isMulti
            name="awards"
            value={selectedProjectStages ?? []}
            onChange={setSelectedProjectStages}
            options={[
              {
                value: 'АФК',
                label: 'АФК',
              },
              {
                value: 'ПД',
                label: 'ПД',
              },
              {
                value: 'РД',
                label: 'РД',
              },
            ]}
            className={styles.form__field}
            placeholder="Выберите стадию"
            components={{
              DropdownIndicator: AnotherDropdownIndicator,
              ValueContainer: AnotherStagesProject,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(LocationStagesBlock);
