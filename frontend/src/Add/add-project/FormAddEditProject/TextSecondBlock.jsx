import { memo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { UiMarksInput } from '../../ui/index.js';

function TextSecondBlock({ styles, inputData, setInputData, quillRef1 }) {
  return (
    <div className={styles.form_container__block_gray_one}>
      <div className={styles.container__heading_block}>
        <UiMarksInput
          name="headingTextBlock"
          label="Заголовок текстового блока"
          placeholder="Не более 56 символов"
          value={inputData.headingTextBlock}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 56) {
              setInputData({ ...inputData, headingTextBlock: value });
            }
          }}
          maxLength={56}
        />
      </div>
      <div className={styles.heading_textarea}>
        <div className={styles.form_container__description_text}>
          <ReactQuill
            ref={quillRef1}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'bullet' }, { list: 'ordered' }],
              ],
              clipboard: {
                matchVisual: false,
              },
            }}
            formats={['bold', 'italic', 'underline', 'list']}
            className={styles.form_container__textarea}
            style={{
              padding: '0rem',
              border: '1px solid var(--blue-75BBFD)',
              fontFamily: 'var(--font-raleway)',
              borderRadius: '6px',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 'var(--fw-400)',
              lineHeight: '16px',
              color: 'var(---black-1D2E43)',
              boxSizing: 'border-box',
              paddingBottom: '2.5rem',
              whiteSpace: 'pre-wrap',
            }}
            required
            name="textBlock"
            id="textBlock"
            value={inputData.textBlock}
            onChange={(value) => {
              setInputData((prevInputData) => ({
                ...prevInputData,
                textBlock: value,
              }));
            }}
            placeholder="Дополнительный текстовый блок"
          />
          <label htmlFor="textBlock" className={styles.form_container__textarea_label_constructor}>
            Текстовый блок
          </label>
        </div>
      </div>
    </div>
  );
}

export default memo(TextSecondBlock);