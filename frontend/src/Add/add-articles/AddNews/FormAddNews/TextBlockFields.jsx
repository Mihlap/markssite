import ReactQuill from 'react-quill-new';
export default function TextBlockFields({ styles, inputData, setInputData, changeHandler, quillRef1 }) {
  return (
    <div className={styles.blockContainer}>
      <div className={styles.form_container__heading_block}>
        <input
          required
          type="input"
          className={styles.form_container__heading_block_input}
          placeholder="Не более 255 символов"
          name="titleTextBlock"
          id="titleTextBlock"
          maxLength="255"
          value={inputData.titleTextBlock}
          onChange={(event) => changeHandler(event, inputData, setInputData)}
        />
        <label htmlFor="titleTextBlock" className={styles.form_container__heading_block_label}>
          Заголовок текстового блока
        </label>
        <div className={styles.form_container__heading_block_input_length}>
          {`${inputData.titleTextBlock.length}/255`}
        </div>
      </div>
      <div className={styles.form_container__description_text}>
        <ReactQuill
          ref={quillRef1}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ list: 'bullet' }, { list: 'ordered' }],
            ],
            clipboard: { matchVisual: false },
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
          name="descriptionArticle"
          id="descriptionArticle"
          value={inputData.descriptionArticle}
          onChange={(value) =>
            setInputData((prevInputData) => ({
              ...prevInputData,
              descriptionArticle: value,
            }))
          }
          placeholder="Нет ограничения по символам"
        />
        <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
          Текст
        </label>
      </div>
    </div>
  );
}
