import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './MarkdownEditor.module.scss';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState('both');
  const editorRef = useRef(null);

  const handleChange = (e) => {
    setMarkdown(e.target.value);
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

  return (
    <div
      ref={editorRef}
      className={`${styles['markdown-editor']} ${isFullscreen ? styles['markdown-editor--fullscreen'] : ''}`}>   
      <div className={styles['markdown-editor__button-panel']}>
        <div className={styles['markdown-editor__button-panel-container']}>
          <button
            onClick={() => handleModeChange('both')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'both' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H8V16H4C1.79086 16 0 14.2091 0 12V4Z" fill="#75BBFD" />
              <path d="M16 4C16 1.79086 14.2091 0 12 0H8V16H12C14.2091 16 16 14.2091 16 12V4Z" fill="#C0C5CB" />
            </svg>
          </button>
          <button
            onClick={() => handleModeChange('markdown')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'markdown' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H8V16H4C1.79086 16 0 14.2091 0 12V4Z" fill="#75BBFD" />
              <path d="M16 4C16 1.79086 14.2091 0 12 0H8V16H12C14.2091 16 16 14.2091 16 12V4Z" fill="#75BBFD" />
            </svg>
          </button>
          <button
            onClick={() => handleModeChange('preview')}
            className={`${styles['markdown-editor__button']} ${
              mode === 'preview' ? styles['markdown-editor__button--active'] : ''
            }`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H8V16H4C1.79086 16 0 14.2091 0 12V4Z" fill="#C0C5CB" />
              <path d="M16 4C16 1.79086 14.2091 0 12 0H8V16H12C14.2091 16 16 14.2091 16 12V4Z" fill="#C0C5CB" />
            </svg>
          </button>
        </div>
        <button onClick={toggleFullscreen} className={styles['markdown-editor__button']}>
          {isFullscreen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.1814 16C10.9161 16 10.6618 15.8946 10.4743 15.7071C10.2867 15.5196 10.1814 15.2652 10.1814 15V12.848C10.1814 12.1408 10.4623 11.4625 10.9624 10.9624C11.4625 10.4623 12.1408 10.1814 12.848 10.1814H15C15.2652 10.1814 15.5196 10.2867 15.7071 10.4743C15.8946 10.6618 16 10.9161 16 11.1814C16 11.4466 15.8946 11.7009 15.7071 11.8885C15.5196 12.076 15.2652 12.1814 15 12.1814H12.848C12.6712 12.1814 12.5016 12.2516 12.3766 12.3766C12.2516 12.5016 12.1814 12.6712 12.1814 12.848V15C12.1814 15.2652 12.076 15.5196 11.8885 15.7071C11.7009 15.8946 11.4466 16 11.1814 16Z"
                fill="#75BBFD"
              />
              <path
                d="M4.11154 15.7071C4.29907 15.8946 4.55342 16 4.81864 16C5.08385 16 5.33821 15.8946 5.52574 15.7071C5.71328 15.5196 5.81863 15.2652 5.81863 15V12.848C5.81863 12.1408 5.53768 11.4625 5.03759 10.9624C4.5375 10.4623 3.85922 10.1814 3.15198 10.1814H0.999995C0.73478 10.1814 0.480427 10.2867 0.292892 10.4743C0.105356 10.6618 3.57023e-07 10.9161 3.33837e-07 11.1814C3.10651e-07 11.4466 0.105356 11.7009 0.292891 11.8885C0.480427 12.076 0.73478 12.1814 0.999995 12.1814H3.15198C3.32879 12.1814 3.49836 12.2516 3.62338 12.3766C3.74841 12.5016 3.81864 12.6712 3.81864 12.848V15C3.81864 15.2652 3.924 15.5196 4.11154 15.7071Z"
                fill="#75BBFD"
              />
              <path
                d="M3.62338 3.62338C3.49836 3.74841 3.32879 3.81864 3.15198 3.81864L0.999994 3.81864C0.734779 3.81864 0.480427 3.924 0.292891 4.11154C0.105356 4.29907 2.31858e-08 4.55342 0 4.81864C-2.31858e-08 5.08385 0.105356 5.33821 0.292891 5.52574C0.480427 5.71328 0.734779 5.81863 0.999994 5.81863L3.15198 5.81863C3.85922 5.81863 4.53749 5.53768 5.03759 5.03759C5.53768 4.5375 5.81863 3.85922 5.81863 3.15198L5.81863 0.999994C5.81863 0.734779 5.71328 0.480427 5.52574 0.292891C5.33821 0.105356 5.08385 2.31858e-08 4.81864 0C4.55342 -2.31858e-08 4.29907 0.105356 4.11154 0.292891C3.924 0.480427 3.81865 0.734779 3.81865 0.999994L3.81864 3.15198C3.81864 3.32879 3.74841 3.49836 3.62338 3.62338Z"
                fill="#75BBFD"
              />
              <path
                d="M15.7071 5.52574C15.8946 5.33821 16 5.08385 16 4.81864C16 4.55342 15.8946 4.29907 15.7071 4.11154C15.5196 3.924 15.2652 3.81864 15 3.81864L12.848 3.81865C12.6712 3.81865 12.5016 3.74841 12.3766 3.62338C12.2516 3.49836 12.1814 3.32879 12.1814 3.15198L12.1814 0.999995C12.1814 0.73478 12.076 0.480427 11.8885 0.292892C11.7009 0.105356 11.4466 4.85496e-07 11.1814 5.08682e-07C10.9161 5.31868e-07 10.6618 0.105356 10.4743 0.292892C10.2867 0.480427 10.1814 0.73478 10.1814 0.999995L10.1814 3.15198C10.1814 3.85922 10.4623 4.5375 10.9624 5.03759C11.4625 5.53768 12.1408 5.81863 12.848 5.81863L15 5.81863C15.2652 5.81863 15.5196 5.71328 15.7071 5.52574Z"
                fill="#75BBFD"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.66667 2C2.48986 2 2.32029 2.07024 2.19526 2.19526C2.07024 2.32029 2 2.48986 2 2.66667V4.81867C2 5.08388 1.89464 5.33824 1.70711 5.52577C1.51957 5.71331 1.26522 5.81867 1 5.81867C0.734784 5.81867 0.480429 5.71331 0.292893 5.52577C0.105357 5.33824 5.58902e-09 5.08388 0 4.81867V2.66667C0 1.95942 0.280951 1.28115 0.781048 0.781048C1.28115 0.280951 1.95942 0 2.66667 0H4.81867C5.08388 5.58902e-09 5.33824 0.105357 5.52577 0.292893C5.71331 0.480429 5.81867 0.734784 5.81867 1C5.81867 1.26522 5.71331 1.51957 5.52577 1.70711C5.33824 1.89464 5.08388 2 4.81867 2H2.66667ZM10.1813 1C10.1813 0.734784 10.2867 0.480429 10.4742 0.292893C10.6618 0.105357 10.9161 0 11.1813 0H13.3333C14.0406 0 14.7189 0.280951 15.219 0.781048C15.719 1.28115 16 1.95942 16 2.66667V4.81867C16 5.08388 15.8946 5.33824 15.7071 5.52577C15.5196 5.71331 15.2652 5.81867 15 5.81867C14.7348 5.81867 14.4804 5.71331 14.2929 5.52577C14.1054 5.33824 14 5.08388 14 4.81867V2.66667C14 2.48986 13.9298 2.32029 13.8047 2.19526C13.6797 2.07024 13.5101 2 13.3333 2H11.1813C10.9161 2 10.6618 1.89464 10.4742 1.70711C10.2867 1.51957 10.1813 1.26522 10.1813 1ZM1 10.1813C1.26522 10.1813 1.51957 10.2867 1.70711 10.4742C1.89464 10.6618 2 10.9161 2 11.1813V13.3333C2 13.5101 2.07024 13.6797 2.19526 13.8047C2.32029 13.9298 2.48986 14 2.66667 14H4.81867C5.08388 14 5.33824 14.1054 5.52577 14.2929C5.71331 14.4804 5.81867 14.7348 5.81867 15C5.81867 15.2652 5.71331 15.5196 5.52577 15.7071C5.33824 15.8946 5.08388 16 4.81867 16H2.66667C1.95942 16 1.28115 15.719 0.781048 15.219C0.280951 14.7189 0 14.0406 0 13.3333V11.1813C0 10.9161 0.105357 10.6618 0.292893 10.4742C0.480429 10.2867 0.734784 10.1813 1 10.1813ZM15 10.1813C15.2652 10.1813 15.5196 10.2867 15.7071 10.4742C15.8946 10.6618 16 10.9161 16 11.1813V13.3333C16 14.0406 15.719 14.7189 15.219 15.219C14.7189 15.719 14.0406 16 13.3333 16H11.1813C10.9161 16 10.6618 15.8946 10.4742 15.7071C10.2867 15.5196 10.1813 15.2652 10.1813 15C10.1813 14.7348 10.2867 14.4804 10.4742 14.2929C10.6618 14.1054 10.9161 14 11.1813 14H13.3333C13.5101 14 13.6797 13.9298 13.8047 13.8047C13.9298 13.6797 14 13.5101 14 13.3333V11.1813C14 10.9161 14.1054 10.6618 14.2929 10.4742C14.4804 10.2867 14.7348 10.1813 15 10.1813Z"
                fill="#75BBFD"
              />
            </svg>
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
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeRaw]}
            components={{
              math: ({ children }) => <BlockMath>{children}</BlockMath>,
              inlineMath: ({ children }) => <InlineMath>{children}</InlineMath>,
              img: ({ src, alt }) => <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />,
              a: ({ href, children }) =>
                href.endsWith('.pdf') ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ) : (
                  <a href={href}>{children}</a>
                ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
