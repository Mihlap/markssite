import { memo } from 'react';
import { UiMarksInput } from '../../ui/index.js';


function TitleTextBlock({ styles, inputData, setInputData }) {
  return (
    <div className={styles.form_container__block_gray_one}>
      <UiMarksInput
        name="titleTextBlock"
        label="Заголовок текстового блока"
        placeholder="Не более 56 символов"
        value={inputData.titleTextBlock}
        onChange={(event) => {
          const value = event.target.value;
          if (value.length <= 56) {
            setInputData({ ...inputData, titleTextBlock: value });
          }
        }}
        maxLength={56}
        required
      />
      {/* блок Описание проекта */}
      <div className={styles.form_container__description_text}>
        <div className={styles.form_container__textarea_length}>{`${inputData.descriptionProject.length}/260`}</div>
        <textarea
          className={styles.form_container__textarea}
          autoComplete="off"
          required
          name="descriptionProject"
          id="descriptionProject"
          cols="30"
          rows="10"
          placeholder="Не более 260 символов"
          value={inputData.descriptionProject}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 260) {
              setInputData({ ...inputData, descriptionProject: value });
            }
          }}></textarea>
        <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
          Описание проекта
        </label>
      </div>
    </div>
  );
}

export default memo(TitleTextBlock);
