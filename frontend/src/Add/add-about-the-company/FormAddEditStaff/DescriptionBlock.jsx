import { memo } from 'react';

export default memo(function DescriptionBlock({ styles, inputData, setInputData }) {
  return (
    <div className={styles.form_container__block_gray_one} style={{ paddingTop: 0, paddingBottom: 16 }}>
      <div className={styles.form_container__description_text}>
        <textarea
          type="input"
          required
          className={styles.form_container__textarea}
          placeholder="Нет ограничения по символам"
          autoComplete="off"
          name="description"
          id="description"
          value={inputData.description || ''}
          onChange={(e) => setInputData((p) => ({ ...p, description: e.target.value }))}
        />
        <label
          htmlFor="textBlock"
          className={styles.form_container__textarea_label_constructor}
          style={{ marginBottom: 10 }}>
          Текст описания
        </label>
      </div>
    </div>
  );
});
