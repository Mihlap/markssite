import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './MarkdownEditor.module.scss';

import full from './icons/full.svg'
import editor from './icons/editor.svg';
import text from './icons/text.svg';
import full_screen from './icons/full_screen.svg';
import collapse from './icons/collapse.svg';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, setFormData, addTemporaryImage } from '../../../store/Slice/journalSlice';

const MarkdownEditor = () => {
  // const [markdown, setMarkdown] = useState('');
  const dispatch = useDispatch();
  const markdown = useSelector((state) => state.journal.formData.markdown_content);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState('both');
  const editorRef = useRef(null);

  const handleChange = (e) => {
     dispatch(setFormData({ name: 'markdown_content', value: e.target.value }));
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (editorRef.current.requestFullscreen) {
        editorRef.current.requestFullscreen();
      } else if (editorRef.current.webkitRequestFullscreen) {
        editorRef.current.webkitRequestFullscreen();
      } else if (editorRef.current.mozRequestFullScreen) {
        editorRef.current.mozRequestFullScreen();
      } else if (editorRef.current.msRequestFullscreen) {
        editorRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

 
const handleDrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;

  if (files.length > 0) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          dispatch(addTemporaryImage({ name: file.name, url: event.target.result }));
        };
        reader.readAsDataURL(file);

        dispatch(uploadImage(file))
          .unwrap()
          .then((uploadedUrl) => {
            console.log('Файл загружен:', uploadedUrl);
          })
          .catch((error) => {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка загрузки изображения.');
          });
      } else {
        alert('Только изображения поддерживаются');
      }
    });
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
            onClick={() => handleModeChange('both')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'both' ? styles['markdown-editor__button--active'] : ''
            }`}>        
            <img src={full} alt="full" />
          </button>
          <button
            onClick={() => handleModeChange('markdown')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'markdown' ? styles['markdown-editor__button--active'] : ''
            }`}>         
            <img src={editor} alt="editor" />
          </button>
          <button
            onClick={() => handleModeChange('preview')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'preview' ? styles['markdown-editor__button--active'] : ''
            }`}>           
            <img src={text} alt="text" />
          </button>
        </div>
        <button onClick={toggleFullscreen} className={styles['markdown-editor__button']}>
          {isFullscreen ? (           
            <img src={collapse} alt="collapse" />
          ) : (         
            <img src={full_screen} alt="full_screen" />
          )}
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
            children={markdown}
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              math: ({ value }) => <BlockMath>{value}</BlockMath>,
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
