import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDebouncedCallback } from 'use-debounce';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypePdfEmbedder from './utils/rehypePdfEmbedder';
import rehypeUniqueHeadingIds from './utils/rehypeUniqueHeadingIds';
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
import { extractMarkdownLinks } from './utils/extractMarkdownLinks';


const PDFEmbedComponent = ({ src, title }) => (
  <div className={styles['markdown-editor__pdfembed']}>
    <iframe src={src} title={title} width="100%" height="350px" style={{ border: 'none' }}>
      Ваш браузер не поддерживает встраивание PDF.
    </iframe>
  </div>
);
PDFEmbedComponent.displayName = 'PDFEmbedComponent';

const MathBlock = ({ value }) => (
  <div className={styles['markdown-editor__mathblock']}>
    <BlockMath>{value}</BlockMath>
  </div>
);
MathBlock.displayName = 'MathBlock';

const flattenChildren = (children) => {
  let result = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props && child.props.children) {
      result.push(child);
      result = result.concat(flattenChildren(child.props.children));
    } else {
      result.push(child);
    }
  });
  return result;
};

const Paragraph = ({ node, children, ...props }) => {
  const flatChildren = flattenChildren(children);
  const hasBlockChild = flatChildren.some((child) => {
    if (child && typeof child === 'object') {
      return child.type === PDFEmbedComponent || child.type === MathBlock;
    }
    return false;
  });
  return hasBlockChild ? (
    <div {...props} className={styles['markdown-editor__paragraph']}>
      {children}
    </div>
  ) : (
    <p {...props} className={styles['markdown-editor__paragraph']}>
      {children}
    </p>
  );
};

const Heading1 = ({ children, ...props }) => (
  <h1 className={styles['markdown-editor__heading1']} {...props}>
    {children}
  </h1>
);
const Heading2 = ({ children, ...props }) => (
  <h2 className={styles['markdown-editor__heading2']} {...props}>
    {children}
  </h2>
);
const Heading3 = ({ children, ...props }) => (
  <h3 className={styles['markdown-editor__heading3']} {...props}>
    {children}
  </h3>
);
const Heading4 = ({ children, ...props }) => (
  <h4 className={styles['markdown-editor__heading4']} {...props}>
    {children}
  </h4>
);
const Heading5 = ({ children, ...props }) => (
  <h5 className={styles['markdown-editor__heading5']} {...props}>
    {children}
  </h5>
);
const Heading6 = ({ children, ...props }) => (
  <h6 className={styles['markdown-editor__heading6']} {...props}>
    {children}
  </h6>
);


const LinkComponent = ({ href, children, ...props }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={styles['markdown-editor__link']}
    {...props}
  >
    {children}
  </a>
);

const Table = ({ children, ...props }) => (
  <div className={styles['markdown-editor__table-container']} style={{ overflowX: 'auto' }}>
    <table className={styles['markdown-editor__table']} {...props}>
      {children}
    </table>
  </div>
);

const List = ({ ordered, children, ...props }) =>
  ordered ? (
    <ol className={styles['markdown-editor__list']} {...props}>
      {children}
    </ol>
  ) : (
    <ul className={styles['markdown-editor__list']} {...props}>
      {children}
    </ul>
  );

  const BlockQuote = ({ children, ...props }) => (
    <blockquote className={styles['markdown-editor__blockquote']} {...props}>
      {children}
    </blockquote>
);
  
const InlineCode = ({ children, ...props }) => (
  <code className={styles['markdown-editor__code']} {...props}>
    {children}
  </code>
);


const CodeBlock = ({ children, ...props }) => (
  <pre className={styles['markdown-editor__pre']} {...props}>
    {children}
  </pre>
);

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

        <div
          ref={previewRef}
          className={styles['markdown-editor__preview']}
          style={{ display: mode === 'markdown' ? 'none' : 'block' }}>
          {markdown.trim() === '' && <div className={styles['markdown-editor__preview-placeholder']}>Предпросмотр</div>}
          <ReactMarkdown
            type="text"
            children={markdown}
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypePdfEmbedder, rehypeUniqueHeadingIds]}
            unwrapDisallowed={true}
            components={{
              h1: Heading1,
              h2: Heading2,
              h3: Heading3,
              h4: Heading4,
              h5: Heading5,
              h6: Heading6,
              p: Paragraph,
              PDFEmbed: PDFEmbedComponent,
              math: MathBlock,
              inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
              img: ({ src, alt }) => <img src={src} alt={alt} className={styles['markdown-editor__img']} />,
              a: LinkComponent,
              table: Table,
              ul: List,
              ol: List,
              blockquote: BlockQuote,
              code: InlineCode,
              pre: CodeBlock,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
