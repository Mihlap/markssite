import { memo, useMemo, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function sanitizeId(s) {
  return String(s || '').replace(/[^a-zA-Z0-9_-]/g, '');
}

let qCounter = 0;
function makeUid(scopeKey) {
  if (scopeKey) return sanitizeId(scopeKey);
  qCounter += 1;
  return `qf-${qCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function isContentEmpty(html) {
  if (!html) return true;
  const text = String(html)
    .replace(/<(.|\n)*?>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text.length === 0;
}

const QuillField = memo(function QuillField(props) {
  const {
    styles = {},
    label,
    value = '',
    onChange = () => {},
    placeholder = '',
    scopeKey,
    className = '',
    labelClassName,
    labelStyle,
    showToolbar = true,
    defaultList,
  } = props;

  const uid = useMemo(() => makeUid(scopeKey), [scopeKey]);
  const scopeClass = `qlScope-${uid}`;
  const toolbarId = `qlToolbar-${uid}`;

  const ph = String(placeholder || '').trim();
  const isNoLimit = ph === 'Нет ограничения по символам';

  const quillRef = useRef(null);
  const initialListApplied = useRef(false);

  useEffect(() => {
    if (!defaultList) return;
    if (initialListApplied.current) return;
    if (!isContentEmpty(value)) return;
    const rq = quillRef.current;
    if (!rq) return;
    const editor = rq.getEditor();
    try {
      editor.setSelection(0, 0);
    } catch {}
    editor.format('list', defaultList);
    initialListApplied.current = true;
  }, [defaultList, value]);

  return (
    <div className={`${styles.form_container__description_text || ''} ${scopeClass} ${className}`.trim()}>
      <style>{`
        /* Порядок: лейбл -> тулбар -> редактор */
        .${scopeClass} { display:grid; grid-auto-rows:auto; row-gap:8px; }

        .${scopeClass} .quillLabel { margin:0; }

        /* Компактный кастом-тулбар */
        .${scopeClass} .quillToolbar {
          display:flex; gap:8px; align-items:center;
          margin:0; padding:0; background:transparent; border:0;
        }
        .${scopeClass} .quillToolbar .ql-formats { display:flex; gap:8px; margin:0; padding:0; }
        .${scopeClass} .quillToolbar .ql-formats button{
          width:24px; height:24px; display:flex; align-items:center; justify-content:center;
          border:none; background:#F6F6F6; border-radius:6px;
          padding:0; outline:none; cursor:pointer; transition:background .15s ease;
        }
        .${scopeClass} .quillToolbar .ql-formats button:hover{ background:rgba(0,0,0,0.06); }
        .${scopeClass} .quillToolbar .ql-formats button svg{ width:18px; height:18px; }

        /* Цвет иконок */
        .${scopeClass} .ql-snow .ql-stroke{ stroke:#8B98A9; }
        .${scopeClass} .ql-snow .ql-fill{ fill:#8B98A9; }
        .${scopeClass} .ql-toolbar button.ql-active .ql-stroke,
        .${scopeClass} .quillToolbar button.ql-active .ql-stroke{ stroke:#1D2E43; stroke-width:2.2; }
        .${scopeClass} .ql-toolbar button.ql-active .ql-fill,
        .${scopeClass} .quillToolbar button.ql-active .ql-fill{ fill:#1D2E43; }

        /* Контейнер редактора */
        .${scopeClass} .ql-container.ql-snow{ border:none; }
        .${scopeClass} .ql-editor{
          padding:1rem !important; border-radius:6px; background:#fff;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,.06);
          font-size:16px; line-height:16px; font-family:Raleway, sans-serif;
          color: var(--black-1D2E43); white-space: pre-wrap; min-height:10.8rem;
        }

        /* Плейсхолдер */
        ${
          isNoLimit
            ? `
        .${scopeClass} .ql-editor.ql-blank::before{
          content: attr(data-placeholder);
          color:#959DA6;
          font-variant-numeric: lining-nums proportional-nums;
          font-family: Raleway;
          font-size:16px; font-style:normal; font-weight:400; line-height:16px;
          white-space:pre-wrap; opacity:1 !important;
        }`
            : ''
        }

        /* focus-рамка для кнопок без синего outline */
        .${scopeClass} .quillToolbar .ql-formats button:focus,
        .${scopeClass} .quillToolbar .ql-formats button:focus-visible{
          outline:none; box-shadow:0 0 0 2px rgba(43,58,85,.15);
        }

        .${scopeClass} .ql-toolbar button:hover .ql-stroke,
        .${scopeClass} .ql-toolbar button:focus .ql-stroke,
        .${scopeClass} .quillToolbar button:hover .ql-stroke,
        .${scopeClass} .quillToolbar button:focus .ql-stroke {
         stroke: #1D2E43;
         }
        .${scopeClass} .ql-toolbar button:hover .ql-fill,
        .${scopeClass} .ql-toolbar button:focus .ql-fill,
        .${scopeClass} .quillToolbar button:hover .ql-fill,
        .${scopeClass} .quillToolbar button:focus .ql-fill {
         fill: #1D2E43;
         }
      `}</style>

      {label ? (
        <div
          className={`quillLabel ${labelClassName || styles.form_container__textarea_label_constructor || ''}`.trim()}
          style={labelStyle}>
          {label}
        </div>
      ) : null}

      {showToolbar ? (
        <div id={toolbarId} className="quillToolbar ql-toolbar ql-snow">
          <span className="ql-formats">
            <button className="ql-bold" aria-label="Полужирный" />
            <button className="ql-underline" aria-label="Подчёркивание" />
            <button className="ql-list" value="bullet" aria-label="Маркированный список" />
          </span>
        </div>
      ) : null}

      <ReactQuill
        ref={quillRef}
        modules={{
          toolbar: showToolbar ? { container: `#${toolbarId}` } : false,
          clipboard: { matchVisual: false },
        }}
        formats={['bold', 'underline', 'list']}
        value={value}
        onChange={onChange}
        placeholder={ph}
        className={`${styles.form_container__textarea || ''} ${styles.orange_color || ''}`.trim()}
        style={{
          padding: '0rem',
          fontFamily: 'var(--font-raleway)',
          borderRadius: '6px',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 'var(--fw-400)',
          lineHeight: '16px',
          color: 'var(--black-1D2E43)',
          boxSizing: 'border-box',
          paddingBottom: '2.5rem',
          whiteSpace: 'pre-wrap',
        }}
      />
    </div>
  );
});

export default QuillField;
