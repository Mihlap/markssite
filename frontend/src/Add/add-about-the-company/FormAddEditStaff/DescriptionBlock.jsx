import { memo, useRef, useState, useEffect } from 'react';
import ErrorTooltip from '../../../UI/ErrorTooltip/ErrorTooltip';

export default memo(function DescriptionBlock({ styles, inputData, setInputData, forceValidate = 0 }) {
  const descRef = useRef(null);
  const [touched, setTouched] = useState(false);

  const descriptionEmpty = !String(inputData?.description || '').trim();

  useEffect(() => {
    if (!forceValidate) return;
    setTouched(true);

    if (descriptionEmpty && descRef.current) {
      descRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      descRef.current.focus?.({ preventScroll: true });
    }
  }, [forceValidate, descriptionEmpty]);

  return (
    <div className={styles.form_container__block_gray_one} style={{ paddingTop: 0, paddingBottom: 16 }}>
      <div className={styles.form_container__description_text} style={{ position: 'relative' }}>
        <textarea
          ref={descRef}
          className={`${styles.form_container__textarea} ${touched && descriptionEmpty ? styles.input_error : ''}`}
          placeholder="Нет ограничения по символам"
          autoComplete="off"
          name="description"
          id="description"
          value={inputData.description || ''}
          onBlur={() => setTouched(true)}
          onChange={(e) => {
            if (!touched) setTouched(true);
            setInputData((p) => ({ ...p, description: e.target.value }));
          }}
          aria-invalid={touched && descriptionEmpty ? 'true' : 'false'}
        />

        <label
          htmlFor="description"
          className={styles.form_container__textarea_label_constructor}
          style={{ marginBottom: 10 }}>
          Текст описания
        </label>

        <ErrorTooltip
          anchorRef={descRef}
          text="Заполните описание"
          isOpen={touched && descriptionEmpty}
          onOpenChange={(open) => {
            if (!open) setTouched(false);
          }}
        />
      </div>
    </div>
  );
});
