import { memo, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Icon1, Icon2, Icon3 } from './icon';

import s from './Styles.module.css';

const icons = Quill.import('ui/icons');

icons['bold'] = Icon1;
icons['underline'] = Icon2;
icons['list'] = Icon3;


const quillFormats = ['bold', 'underline', 'list'];

function MarksTextarea({ name, label, value, onChange, placeholder, color = 'blue', error, Quill = false, quillRef }) {
  const toolbarId = `toolbar-${name}`;

  const quillModules = useMemo(() => ({
    toolbar: { container: `#${toolbarId}` },
    clipboard: { matchVisual: false },
  }), [toolbarId]);

  return (
    <div className={s.textarea__wrap}>
      {Quill ? (
        <>
          <div id={toolbarId} className={s.toolbar}>
            <button className="ql-bold"><Icon1 /></button>
            <button className="ql-underline"><Icon2 /></button>
            <button className="ql-list" value="bullet"><Icon3 /></button>
          </div>
          <ReactQuill
            ref={quillRef}
            modules={quillModules}
            formats={quillFormats}
            className={`${s.quill} ${error ? s.quill_error : ''}`}
            name={name}
            id={name}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder || name}
          />
        </>
      ) : (
        <textarea
          className={`${s.textarea} ${error ? s.textarea_error : ''}`}
          name={name}
          id={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder || name}
        />
      )}
      <label htmlFor={name} className={s.textarea__label}>
        {label}
      </label>
      {error && <span className={s.textarea__error}>{error}</span>}
    </div>
  );
}

export default memo(MarksTextarea);
