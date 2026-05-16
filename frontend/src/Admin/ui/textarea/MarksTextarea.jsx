import { memo, useMemo, useCallback, forwardRef, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Icon1, Icon2, Icon3 } from './icon';

import s from './Styles.module.css';

const icons = Quill.import('ui/icons');

icons['bold'] = Icon1;
icons['underline'] = Icon2;
icons['list'] = Icon3;


const quillFormats = ['bold', 'underline', 'list'];

const MarksTextarea = forwardRef(function MarksTextarea(
  { name, label, value, onChange, placeholder, color = 'blue', error, richText = false, quillRef, maxLength },
  ref
) {
  const toolbarId = `toolbar-${name.replaceAll('.', '-')}`;
  const showCounter = maxLength != null;
  const internalQuillRef = useRef(null);

  const textLength = useMemo(() => {
    if (!showCounter) return 0;
    if (!richText) return (value || '').length;
    const div = document.createElement('div');
    div.innerHTML = value || '';
    return div.textContent.length;
  }, [showCounter, richText, value]);

  const handleQuillChange = useCallback((content, _delta, _source, editor) => {
    if (maxLength != null && editor.getText().length - 1 > maxLength) {
      const quill = (quillRef ?? internalQuillRef).current?.getEditor();
      quill?.deleteText(maxLength, quill.getLength());
      return;
    }
    onChange(content);
  }, [maxLength, onChange, quillRef]);

  const quillModules = useMemo(
    () => ({
      toolbar: { container: `#${toolbarId}` },
      clipboard: { matchVisual: false },
    }),
    [toolbarId]
  );

  return (
    <div className={s.textarea__wrap}>
      {richText ? (
        <>
          <div id={toolbarId} className={`${s.toolbar} ${s[`toolbar_${color}`] || ''}`}>
            <button className="ql-bold">
              <Icon1 />
            </button>
            <button className="ql-underline">
              <Icon2 />
            </button>
            <button className="ql-list" value="bullet">
              <Icon3 />
            </button>
          </div>
          <div className={s.textarea__field_wrap}>
            <ReactQuill
              ref={quillRef ?? internalQuillRef}
              modules={quillModules}
              formats={quillFormats}
              className={`${s.quill} ${s[`quill_${color}`] || ''} ${error ? s.quill_error : ''}`}
              name={name}
              id={name}
              value={value ?? ''}
              onChange={handleQuillChange}
              placeholder={placeholder || name}
            />
            {showCounter && <div className={s.textarea__counter}>{`${textLength}/${maxLength}`}</div>}
          </div>
        </>
      ) : (
        <div className={s.textarea__field_wrap}>
          <textarea
            ref={ref}
            className={`${s.textarea} ${s[`textarea_${color}`] || ''} ${error ? s.textarea_error : ''}`}
            name={name}
            id={name}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder || name}
            maxLength={maxLength}
          />
          {showCounter && <div className={s.textarea__counter}>{`${textLength}/${maxLength}`}</div>}
        </div>
      )}
      <label htmlFor={name} className={s.textarea__label}>
        {label}
      </label>
      {error && <span className={s.textarea__error}>{error}</span>}
    </div>
  );
});

export default memo(MarksTextarea);
