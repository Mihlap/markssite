import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import MarkdownContentRenderer from '../../../UI/MarkdownContentRenderer/MarkdownContentRenderer';

import { Icon1, Icon2, Icon3, Icon4, Icon5 } from './icon';
import styles from './MarksMarkDown.module.scss';

const iconColors = {
  blue: 'var(--blue-75BBFD)',
  salmon: 'var(--salmon-FF7F6A)',
};

const lightColors = {
  blue: 'var(--light-blue-D4EDFB)',
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

  const iconColor = iconColors[color] || iconColors.blue;
  const lightColor = lightColors[color] || lightColors.blue;

  return (
    <div
      ref={editorRef}
      className={`${styles.md} ${isFullscreen ? styles['md--fs'] : ''}`}
      style={{ '--md-accent': iconColor, '--md-light': lightColor }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}>
      <div className={styles.md__label}>Тело статьи</div>
      <div className={styles.md__toolbar}>
        <div className={styles['md__btn-group']}>
          <button
            type="button"
            onClick={() => handleModeChange('both')}
            className={`${styles.md__btn} ${mode === 'both' ? styles['md__btn--active'] : ''}`}>
            <Icon1 color={iconColor} />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('markdown')}
            className={`${styles.md__btn} ${mode === 'markdown' ? styles['md__btn--active'] : ''}`}>
            <Icon2 color={iconColor} />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('preview')}
            className={`${styles.md__btn} ${mode === 'preview' ? styles['md__btn--active'] : ''}`}>
            <Icon3 color={iconColor} />
          </button>
        </div>
        <button type="button" onClick={toggleFullscreen} className={styles.md__btn}>
          {isFullscreen ? <Icon5 color={iconColor} /> : <Icon4 color={iconColor} />}
        </button>
      </div>

      <div className={styles.md__main}>
        <div
          className={styles.md__editor}
          style={{ display: mode === 'preview' ? 'none' : 'block' }}>
          <textarea
            placeholder="Markdown"
            value={value || ''}
            onChange={handleChange}
            className={styles.md__textarea}
          />
        </div>
        <div className={styles.md__preview} style={{ display: mode === 'markdown' ? 'none' : 'block' }}>
          {(value || '').trim() === '' ? (
            <div className={styles.md__placeholder}>Предпросмотр</div>
          ) : (
            <MarkdownContentRenderer markdown={value || ''} />
          )}
        </div>
      </div>
    </div>
  );
}
