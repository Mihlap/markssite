import { memo } from 'react';
import Select from 'react-select';
import { 
  AnotherDropdownIndicator,
  AnotherValueContainer,
  AnotherStagesProject,
} from './utils/CustomSelectComponents';

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
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="input"
            className={styles.form__field}
            placeholder="location"
            name="location"
            autoComplete="off"
            id="location"
            value={inputData.location ?? ''}
            onChange={(event) => changeHandler(event, inputData, setInputData)}
          />
          <label htmlFor="location" className={styles.form__label}>
            Расположение: Город, улица, номер дома
          </label>
        </div>
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
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="input"
            className={styles.form__field}
            placeholder="customer"
            name="customer"
            autoComplete="off"
            id="customer"
            value={inputData.customer ?? ''}
            onChange={(event) => changeHandler(event, inputData, setInputData)}
          />
          <label htmlFor="customer" className={styles.form__label}>
            Заказчик
          </label>
        </div>

        <div className={styles.form_container__block_gray_flex}>
          <div className={styles.form_container__block_public}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="publication"
                name="publication"
                autoComplete="off"
                id="publication"
                value={inputData.publication ?? ''}
                onChange={(event) => changeHandler(event, inputData, setInputData)}
              />
              <label htmlFor="publication" className={styles.form__label}>
                Публикация
              </label>
            </div>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="publicationTwo"
                name="publicationTwo"
                id="publicationTwo"
                autoComplete="off"
                value={inputData.publicationTwo ?? ''}
                onChange={(event) => changeHandler(event, inputData, setInputData)}
              />
              <label htmlFor="publicationTwo" className={styles.form__label}>
                Публикация
              </label>
            </div>
          </div>
          <div className={styles.form_container__block_public_link}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="linkToPublication"
                name="linkToPublication"
                id="linkToPublication"
                autoComplete="off"
                value={inputData.linkToPublication ?? ''}
                onChange={(event) => changeHandler(event, inputData, setInputData)}
              />
              <label htmlFor="linkToPublication" className={styles.form__label}>
                Ссылк на статью
              </label>
            </div>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="linkToPublicationTwo"
                name="linkToPublicationTwo"
                id="linkToPublicationTwo"
                autoComplete="off"
                value={inputData.linkToPublicationTwo ?? ''}
                onChange={(event) => changeHandler(event, inputData, setInputData)}
              />
              <label htmlFor="linkToPublicationTwo" className={styles.form__label}>
                Ссылк на статью
              </label>
            </div>
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