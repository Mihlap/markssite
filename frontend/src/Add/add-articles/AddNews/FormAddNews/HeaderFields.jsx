import Select from 'react-select';
export default function HeaderFields({
  inputData,
  setInputData,
  selectedCompetencies,
  setSelectedCompetencies,
  setIsFocused,
  customStyles,
  styles,
  PublicationIndicator,
  PublicationContainer,
  changeHandler,
}) {
  return (
    <div className={styles.form_container__block_gray_one}>
      <div className={`${styles.form__group} ${styles.field}`}>
        <input
          required
          type="text"
          className={styles.form__field}
          placeholder="title"
          name="title"
          id="title"
          value={inputData.title}
          onChange={(event) => changeHandler(event, inputData, setInputData)}
        />
        <label htmlFor="title" className={styles.form__label}>
          Название
        </label>
      </div>
      <div className={`${styles.form__group} ${styles.field}`}>
        <input
          type="text"
          className={styles.form__field}
          placeholder="author"
          autoComplete="off"
          name="author"
          id="author"
          value={inputData.author}
          onChange={(event) => changeHandler(event, inputData, setInputData)}
        />
        <label htmlFor="author" className={styles.form__label}>
          Автор
        </label>
      </div>
      <div className={`${styles.form__group} ${styles.field}`}>
        <input
          required
          type="text"
          className={styles.form__field}
          autoComplete="off"
          placeholder="city"
          name="city"
          id="city"
          value={inputData.city}
          onChange={(event) => changeHandler(event, inputData, setInputData)}
        />
        <label htmlFor="city" className={styles.form__label}>
          Издание, город
        </label>
      </div>
      <div className={`${styles.form__group} ${styles.field}`}>
        <input
          type="text"
          required
          className={styles.form__field}
          autoComplete="off"
          placeholder="dataMonthYear"
          name="dataMonthYear"
          id="dataMonthYear"
          value={inputData.dataMonthYear}
          onChange={(event) => changeHandler(event, inputData, setInputData)}
        />
        <label htmlFor="dataMonthYear" className={styles.form__label}>
          Дата, месяц, год
        </label>
      </div>
      <Select
        styles={customStyles}
        isMulti
        name="selectCompetencies"
        value={selectedCompetencies}
        onChange={setSelectedCompetencies}
        options={[
          { value: 'Выступления', label: 'Выступления' },
          { value: 'Интервью', label: 'Интервью' },
          { value: 'Новости', label: 'Новости' },
          { value: 'Статьи', label: 'Статьи' },
          { value: 'Научные публикации', label: 'Научные публикации' },
        ]}
        className={styles.form__field}
        placeholder="Выберите табы фильтрации"
        components={{
          DropdownIndicator: PublicationIndicator,
          ValueContainer: PublicationContainer,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
