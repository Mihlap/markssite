import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function SecondaryTextBlock({ styles, quillRef2, inputData, setInputData }) {
  return (
    <div className={styles.blockContainer}>
      <div className={styles.form_container__description_text}>
        <ReactQuill
          ref={quillRef2}
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
          onChange={(value) => setInputData((prev) => ({ ...prev, textBlock: value }))}
          placeholder="Нет ограничения по символам"
        />
        <label htmlFor="textBlock" className={styles.form_container__textarea_label}>
          Текстовый блок
        </label>
      </div>
    </div>
  );
}
