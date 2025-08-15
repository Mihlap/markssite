import { memo } from "react";
function TitleTextBlock({ styles, inputData, setInputData }) {
  return (
    <div className={styles.form_container__block_gray_one}>
      <div className={styles.form_container__heading_block}>
        <input
          type="input"
          className={styles.form_container__heading_block_input}
          placeholder="Не более 56 символов"
          name="titleTextBlock"
          id="titleTextBlock"
          maxLength="56"
          value={inputData.titleTextBlock}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 56) {
              setInputData({ ...inputData, titleTextBlock: value });
            }
          }}
          autoComplete="off"
          required
        />
        <label htmlFor="titleTextBlock" className={styles.form_container__heading_block_label}>
          Заголовок текстового блока
        </label>
        <div className={styles.form_container__heading_block_input_length}>
          {`${inputData.titleTextBlock.length}/56`}
        </div>
      </div>
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