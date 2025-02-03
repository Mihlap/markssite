import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDebouncedCallback } from 'use-debounce';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypePdfEmbedder from './rehypePdfEmbedder';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './MarkdownEditor.module.scss';

import full from './icons/full.svg';
import editor from './icons/editor.svg';
import text from './icons/text.svg';
import full_screen from './icons/full_screen.svg';
import collapse from './icons/collapse.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, uploadMarkdownFile, deleteMarkdownFile } from '../../../store/Slice/journalSlice';
import { extractMarkdownLinks } from './utils';

const MarkdownEditor = ({ onTempFilesChange }) => {
  const dispatch = useDispatch();
  const markdown = useSelector((state) => state.journal.formData.markdown_content);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(new Map());
  const [mode, setMode] = useState('both');
  const editorRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      dispatch(setFormData({ name: 'markdown_content', value: e.target.value }));
    },
    [dispatch]
  );

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        if (editorRef.current) {
          await editorRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE/Edge

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
    const newValue = currentValue.substring(0, start) + textToInsert + currentValue.substring(end);
    textarea.value = newValue;
    const newCursorPos = start + textToInsert.length;
    textarea.selectionStart = newCursorPos;
    textarea.selectionEnd = newCursorPos;
    return newValue;
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (!files.length) return;
      const textarea = e.target.closest('textarea');
      for (let file of files) {
        try {
          const isImage = file.type.startsWith('image/');
          const isPdf = file.type === 'application/pdf';
          if (!isImage && !isPdf) continue;
          const url = await dispatch(uploadMarkdownFile(file)).unwrap();

          setUploadedFiles((prev) => {
            const newMap = new Map(prev);
            const count = newMap.get(url) || 0;
            newMap.set(url, count + 1);

            if (onTempFilesChange) {
              onTempFilesChange(Array.from(newMap.keys()));
            }
            return newMap;
          });

          let markdownString = '';
          if (isImage) {
            markdownString = `![Alt text](${url})`;
          } else if (isPdf) {
            markdownString = `[${file.name}](${url})`;
          }
          if (textarea) {
            const updatedValue = insertTextAtCursor(textarea, markdownString);
            dispatch(setFormData({ name: 'markdown_content', value: updatedValue }));
          } else {
            dispatch(setFormData({ name: 'markdown_content', value: markdown + '\n' + markdownString }));
          }
        } catch (err) {
          console.error('Ошибка при загрузке файла или вставке в markdown:', err);
        }
      }
    },
    [dispatch, insertTextAtCursor, markdown, onTempFilesChange]
  );

  const debouncedCheck = useDebouncedCallback(() => {
    const currentLinks = extractMarkdownLinks(markdown);
    uploadedFiles.forEach((count, fileUrl) => {
      if (!currentLinks.includes(fileUrl)) {
        setUploadedFiles((prev) => {
          const newMap = new Map(prev);
          const currentCount = newMap.get(fileUrl) || 0;
          if (currentCount > 1) {
            newMap.set(fileUrl, currentCount - 1);
          } else {
            dispatch(deleteMarkdownFile(fileUrl))
              .unwrap()
              .catch((err) => {
                console.error('Ошибка удаления файла:', err);
              });
            newMap.delete(fileUrl);
          }

          if (onTempFilesChange) {
            onTempFilesChange(Array.from(newMap.keys()));
          }
          return newMap;
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
            <img src={full} alt="full" />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('markdown')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'markdown' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <img src={editor} alt="editor" />
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('preview')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'preview' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <img src={text} alt="text" />
          </button>
        </div>
        <button type="button" onClick={toggleFullscreen} className={styles['markdown-editor__button']}>
          {isFullscreen ? <img src={collapse} alt="collapse" /> : <img src={full_screen} alt="full_screen" />}
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

        <div className={styles['markdown-editor__preview']} style={{ display: mode === 'markdown' ? 'none' : 'block' }}>
          {markdown.trim() === '' && <div className={styles['markdown-editor__preview-placeholder']}>Предпросмотр</div>}
          <ReactMarkdown
            type="text"
            children={markdown}
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug, rehypePdfEmbedder]}
            unwrapDisallowed={true}
            components={{
              p: ({ children }) => {
                const shouldNotWrap = React.Children.toArray(children).some(
                  (child) =>
                    child &&
                    typeof child === 'object' &&
                    (child.type === 'PDFEmbed' ||
                      (child.type === 'div' && child.props && child.props.style && child.props.style.border === 'none'))
                );
                return shouldNotWrap ? <>{children}</> : <p>{children}</p>;
              },
              PDFEmbed: ({ src, title }) => (
                <div style={{ margin: '1em 0' }}>
                  <iframe src={src} title={title} width="100%" height="350px" style={{ border: 'none' }}>
                    Ваш браузер не поддерживает встраивание PDF.
                  </iframe>
                </div>
              ),
              math: ({ value }) => (
                <div style={{ margin: '1em 0' }}>
                  <BlockMath>{value}</BlockMath>
                </div>
              ),
              inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
                />
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div style={{ overflowX: 'auto' }}>
                  <table>{children}</table>
                </div>
              ),
              ul: ({ children }) => <ul style={{ margin: '1em 0' }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ margin: '1em 0' }}>{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote style={{ borderLeft: '4px solid #75BBFD', paddingLeft: '16px', color: '#666' }}>
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code style={{ backgroundColor: '#f4f4f4', padding: '4px', borderRadius: '4px' }}>{children}</code>
              ),
              pre: ({ children }) => (
                <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '6px', overflowX: 'auto' }}>
                  {children}
                </pre>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
