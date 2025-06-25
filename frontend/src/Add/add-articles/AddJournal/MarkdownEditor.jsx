import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, uploadMarkdownFile, deleteMarkdownFile } from '../../../store/Slice/journalSlice';
import { extractMarkdownLinks } from './utils/extractMarkdownLinks';
import styles from './MarkdownEditor.module.scss';
import articleStyles from '../../../Journal/JournalArticlePage/ArticleJournalPage.module.scss';

import MarkdownContentRenderer from '../../../UI/MarkdownContentRenderer/MarkdownContentRenderer';

import full from './icons/full.svg';
import editor from './icons/editor.svg';
import text from './icons/text.svg';
import full_screen from './icons/full_screen.svg';
import collapse from './icons/collapse.svg';

const MarkdownEditor = ({ onTempFilesChange }) => {
  const dispatch = useDispatch();
  const markdown = useSelector((s) => s.journal.formData.markdown_content);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(new Map());
  const [mode, setMode] = useState('both');

  const editorRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    onTempFilesChange?.(Array.from(uploadedFiles.keys()));
  }, [uploadedFiles, onTempFilesChange]);

  const handleChange = useCallback(
    (e) => {
      dispatch(setFormData({ name: 'markdown_content', value: e.target.value }));
    },
    [dispatch]
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((f) => !f);
  }, []);

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

  const handleModeChange = useCallback((m) => {
    setMode(m);
  }, []);

  const insertTextAtCursor = useCallback((ta, txt) => {
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const v = ta.value;
    const newVal = v.slice(0, start) + txt + v.slice(end);
    ta.value = newVal;
    const pos = start + txt.length;
    ta.selectionStart = ta.selectionEnd = pos;
    return newVal;
  }, []);

   const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type.startsWith('image/') || f.type === 'application/pdf'
      );
      if (!files.length) return;
      const textarea = e.target.closest('textarea');
      for (let file of files) {
        try {
          const url = await dispatch(uploadMarkdownFile(file)).unwrap();
          setUploadedFiles((prev) => {
            const m = new Map(prev);
            m.set(url, (m.get(url) || 0) + 1);
            return m;
          });
          const tag = file.type.startsWith('image/') ? `![Alt](${url})` : `[${file.name}](${url})`;
          const newMd = textarea ? insertTextAtCursor(textarea, tag) : markdown + '\n' + tag;
          dispatch(setFormData({ name: 'markdown_content', value: newMd }));
        } catch (err) {
          console.error(err);
        }
      }
    },
    [dispatch, insertTextAtCursor, markdown]
  );

  const debouncedCheck = useDebouncedCallback(() => {
    const links = extractMarkdownLinks(markdown);
    uploadedFiles.forEach((count, url) => {
      if (!links.includes(url)) {
        setUploadedFiles((prev) => {
          const m = new Map(prev);
          const c = m.get(url) || 0;
          if (c > 1) {
            m.set(url, c - 1);
          } else {
            dispatch(deleteMarkdownFile(url)).unwrap().catch(console.error);
            m.delete(url);
          }
          return m;
        });
      }
    });
  }, 500);

  useEffect(() => {
    debouncedCheck();
  }, [markdown, debouncedCheck]);

  return (
    <div
      ref={editorRef}
      className={`${styles['markdown-editor']} ${isFullscreen ? styles['markdown-editor--fullscreen'] : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}>
      <div className={styles['markdown-editor__button-panel']}>
        <div className={styles['markdown-editor__button-panel-container']}>
          <button
            type="button"
            onClick={() => handleModeChange('both')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'both' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <img src={full} alt="both" />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('markdown')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'markdown' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <img src={editor} alt="markdown" />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('preview')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'preview' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <img src={text} alt="preview" />
          </button>
        </div>
        <button type="button" onClick={toggleFullscreen} className={styles['markdown-editor__button']}>
          {isFullscreen ? <img src={collapse} alt="collapse" /> : <img src={full_screen} alt="fullscreen" />}
        </button>
      </div>

      <div className={styles['markdown-editor__content']}>
        {/* редактор */}
        <div className={styles['markdown-editor__editor']} style={{ display: mode === 'preview' ? 'none' : 'block' }}>
          <textarea
            placeholder="Markdown"
            value={markdown}
            onChange={handleChange}
            className={styles['markdown-editor__editor-textarea']}
          />
        </div>

        {/* превью */}
        <div
          ref={previewRef}
          className={`
            ${styles['markdown-editor__preview']}
            ${articleStyles.markdown_body}
          `}
          style={{ display: mode === 'markdown' ? 'none' : 'block' }}>
          {markdown.trim() === '' ? (
            <div className={styles['markdown-editor__preview-placeholder']}>Предпросмотр</div>
          ) : (
            <MarkdownContentRenderer markdown={markdown} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
