import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, uploadMarkdownFile, deleteMarkdownFile } from '../../../store/Slice/journalSlice';
import { extractMarkdownLinks } from './utils/extractMarkdownLinks';
import styles from './MarkdownEditor.module.scss';
import MarkdownContentRenderer from '../../../UI/MarkdownContentRenderer/MarkdownContentRenderer';

import full from './icons/full.svg';
import editor from './icons/editor.svg';
import text from './icons/text.svg';
import full_screen from './icons/full_screen.svg';
import collapse from './icons/collapse.svg';

const MarkdownEditor = ({ onTempFilesChange }) => {
  const dispatch = useDispatch();
  const markdown = useSelector((state) => state.journal.formData.markdown_content);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(new Map());
  const [mode, setMode] = useState('both');
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      dispatch(setFormData({ name: 'markdown_content', value: e.target.value }));
    },
    [dispatch]
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  const insertTextAtCursor = useCallback((textarea, textToInsert) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    const newValue = currentValue.slice(0, start) + textToInsert + currentValue.slice(end);
    textarea.value = newValue;
    const pos = start + textToInsert.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
    return newValue;
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (!files.length) return;
      const textarea = e.target.closest('textarea');
      for (let file of files) {
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';
        if (!isImage && !isPdf) continue;
        try {
          const url = await dispatch(uploadMarkdownFile(file)).unwrap();
          setUploadedFiles((prev) => {
            const map = new Map(prev);
            map.set(url, (map.get(url) || 0) + 1);
            onTempFilesChange?.(Array.from(map.keys()));
            return map;
          });
          const tag = isImage ? `![Alt](${url})` : `[${file.name}](${url})`;
          const newMd = textarea ? insertTextAtCursor(textarea, tag) : markdown + '\n' + tag;
          dispatch(setFormData({ name: 'markdown_content', value: newMd }));
        } catch (err) {
          console.error(err);
        }
      }
    },
    [dispatch, insertTextAtCursor, markdown, onTempFilesChange]
  );

  const debouncedCheck = useDebouncedCallback(() => {
    const links = extractMarkdownLinks(markdown);
    uploadedFiles.forEach((count, url) => {
      if (!links.includes(url)) {
        setUploadedFiles((prev) => {
          const map = new Map(prev);
          const c = map.get(url) || 0;
          if (c > 1) map.set(url, c - 1);
          else {
            dispatch(deleteMarkdownFile(url)).unwrap().catch(console.error);
            map.delete(url);
          }
          onTempFilesChange?.(Array.from(map.keys()));
          return map;
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
        <div className={styles['markdown-editor__editor']} style={{ display: mode === 'preview' ? 'none' : 'block' }}>
          <textarea
            placeholder="Markdown"
            value={markdown}
            onChange={handleChange}
            className={styles['markdown-editor__editor-textarea']}
          />
        </div>

        <div
          ref={previewRef}
          className={styles['markdown-editor__preview']}
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
