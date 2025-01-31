import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
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
import { setFormData, uploadMarkdownFile } from '../../../store/Slice/journalSlice';

const MarkdownEditor = () => {
  const dispatch = useDispatch();
  const markdown = useSelector((state) => state.journal.formData.markdown_content);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState('both');
  const editorRef = useRef(null);

  const handleChange = (e) => {
      dispatch(setFormData({ name: 'markdown_content', value: e.target.value }));  
  };

  const toggleFullscreen = async () => {
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
  };

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

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const insertTextAtCursor = (textarea, textToInsert) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;

    const newValue = currentValue.substring(0, start) + textToInsert + currentValue.substring(end, currentValue.length);

    textarea.value = newValue;

    const newCursorPos = start + textToInsert.length;
    textarea.selectionStart = newCursorPos;
    textarea.selectionEnd = newCursorPos;

    return newValue;
  };

  const handleDrop = async (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const textarea = e.target.closest('textarea');

    for (let file of files) {
      try {
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';

        if (!isImage && !isPdf) {
          continue;
        }

        const url = await dispatch(uploadMarkdownFile(file)).unwrap();

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
  };

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
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypePdfEmbedder]}
            components={{
              p: ({ children }) => {             
                const hasInvalidChildren = React.Children.toArray(children).some((child) => {
                  if (typeof child !== 'object' || !child) return false;
                  return child.type && ['BlockMath', 'PDFEmbed', 'div', 'iframe'].includes(child.type);
                });

                if (hasInvalidChildren) {
                  return <>{children}</>;
                }
                return <p>{children}</p>;
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
