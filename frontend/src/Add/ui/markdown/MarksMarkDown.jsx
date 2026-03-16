import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import MarkdownContentRenderer from '../../../UI/MarkdownContentRenderer/MarkdownContentRenderer';
import styles from './MarksMarkDown.module.scss';

import full from '../../add-articles/AddJournal/icons/full.svg';
import editor from '../../add-articles/AddJournal/icons/editor.svg';
import text from '../../add-articles/AddJournal/icons/text.svg';
import full_screen from '../../add-articles/AddJournal/icons/full_screen.svg';
import collapse from '../../add-articles/AddJournal/icons/collapse.svg';

const editorBg = {
  blue: 'var(--blue-light-BADDFE)',
  salmon: 'var(--salmon-light-FFBFB5)',
};

function extractLinks(md = '') {
  const re = /!\[[^\]]*]\(([^)]+)\)|\[[^\]]*]\(([^)]+)\)/g;
  const out = [];
  let m;
  while ((m = re.exec(md))) out.push(m[1] || m[2]);
  return out;
}

export default function MarksMarkDown({
  value,
  onChange,
  onUploadFile,
  onDeleteFile,
  onTempFilesChange,
  color = 'blue',
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState('both');
  const [uploadedFiles, setUploadedFiles] = useState(() => new Map());

  const editorRef = useRef(null);

  useEffect(() => {
    onTempFilesChange?.(Array.from(uploadedFiles.keys()));
  }, [uploadedFiles, onTempFilesChange]);

  const handleChange = useCallback((e) => onChange?.(e.target.value), [onChange]);

  const toggleFullscreen = useCallback(() => setIsFullscreen((f) => !f), []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    document.addEventListener('mozfullscreenchange', onFs);
    document.addEventListener('MSFullscreenChange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
      document.removeEventListener('mozfullscreenchange', onFs);
      document.removeEventListener('MSFullscreenChange', onFs);
    };
  }, []);

  const handleModeChange = useCallback((m) => setMode(m), []);

  const insertTextAtCursor = useCallback((ta, txt) => {
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const newVal = ta.value.slice(0, start) + txt + ta.value.slice(end);
    ta.value = newVal;
    ta.selectionStart = ta.selectionEnd = start + txt.length;
    return newVal;
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      if (!onUploadFile) return;
      const files = Array.from(e.dataTransfer.files || []).filter(
        (f) => f.type.startsWith('image/') || f.type === 'application/pdf'
      );
      if (!files.length) return;
      const textarea = e.target.closest('textarea');
      for (const file of files) {
        try {
          const url = await onUploadFile(file);
          setUploadedFiles((prev) => {
            const m = new Map(prev);
            m.set(url, (m.get(url) || 0) + 1);
            return m;
          });
          const tag = file.type.startsWith('image/') ? `![Alt](${url})` : `[${file.name}](${url})`;
          const newMd = textarea ? insertTextAtCursor(textarea, tag) : (value || '') + '\n' + tag;
          onChange?.(newMd);
        } catch (err) {
          console.error('upload markdown file failed', err);
        }
      }
    },
    [onUploadFile, insertTextAtCursor, onChange, value]
  );

  const debouncedCheck = useDebouncedCallback(() => {
    const links = extractLinks(value || '');
    uploadedFiles.forEach((count, url) => {
      if (!links.includes(url)) {
        setUploadedFiles((prev) => {
          const m = new Map(prev);
          const c = m.get(url) || 0;
          if (c > 1) {
            m.set(url, c - 1);
          } else {
            onDeleteFile?.(url);
            m.delete(url);
          }
          return m;
        });
      }
    });
  }, 500);

  useEffect(() => {
    debouncedCheck();
  }, [value, debouncedCheck]);

  const bg = editorBg[color] || editorBg.blue;

  return (
    <div
      ref={editorRef}
      className={`${styles['markdown-editor']} ${isFullscreen ? styles['markdown-editor--fullscreen'] : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}>
      <div className={styles['markdown-editor__label']}>Тело статьи</div>
      <div className={styles['markdown-editor__button-panel']}>
        <div className={styles['markdown-editor__button-panel-container']}>
          <button
            type="button"
            onClick={() => handleModeChange('both')}
            className={`${styles['markdown-editor__button']} ${mode === 'both' ? styles['markdown-editor__button--active'] : ''}`}>
            <img src={full} alt="both" />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('markdown')}
            className={`${styles['markdown-editor__button']} ${mode === 'markdown' ? styles['markdown-editor__button--active'] : ''}`}>
            <img src={editor} alt="markdown" />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('preview')}
            className={`${styles['markdown-editor__button']} ${mode === 'preview' ? styles['markdown-editor__button--active'] : ''}`}>
            <img src={text} alt="preview" />
          </button>
        </div>
        <button type="button" onClick={toggleFullscreen} className={styles['markdown-editor__button']}>
          {isFullscreen ? <img src={collapse} alt="collapse" /> : <img src={full_screen} alt="fullscreen" />}
        </button>
      </div>

      <div className={styles['markdown-editor__content']}>
        <div
          className={styles['markdown-editor__editor']}
          style={{ display: mode === 'preview' ? 'none' : 'block', backgroundColor: bg }}>
          <textarea
            placeholder="Markdown"
            value={value || ''}
            onChange={handleChange}
            className={styles['markdown-editor__editor-textarea']}
          />
        </div>
        <div className={styles['markdown-editor__preview']} style={{ display: mode === 'markdown' ? 'none' : 'block' }}>
          {(value || '').trim() === '' ? (
            <div className={styles['markdown-editor__preview-placeholder']}>Предпросмотр</div>
          ) : (
            <MarkdownContentRenderer markdown={value || ''} />
          )}
        </div>
      </div>
    </div>
  );
}
