import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
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
import { parseChapters } from './utils/parseChapters';

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
    if (React.isValidElement(child) && child.props?.children) {
      result.push(child);
      result = result.concat(flattenChildren(child.props.children));
    } else {
      result.push(child);
    }
  });
  return result;
};

const Paragraph = ({ node, children, ...props }) => {
  const flat = flattenChildren(children);
  const hasBlock = flat.some(
    (c) => c && typeof c === 'object' && (c.type === PDFEmbedComponent || c.type === MathBlock)
  );
  return hasBlock ? (
    <div {...props} className={styles['markdown-editor__paragraph']}>
      {children}
    </div>
  ) : (
    <p {...props} className={styles['markdown-editor__paragraph']}>
      {children}
    </p>
  );
};

const Heading =
  (level) =>
  ({ children, ...props }) =>
    React.createElement(`h${level}`, { ...props, className: styles[`markdown-editor__heading${level}`] }, children);

const LinkComponent = ({ href, children, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={styles['markdown-editor__link']} {...props}>
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

const markdownComponents = {
  h1: Heading(1),
  h2: Heading(2),
  h3: Heading(3),
  h4: Heading(4),
  h5: Heading(5),
  h6: Heading(6),
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
};

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
          {markdown.trim() === '' && <div className={styles['markdown-editor__preview-placeholder']}>Предпросмотр</div>}

          {useMemo(() => parseChapters(markdown), [markdown]).map((chapter, idx) => {
            const rawTitle = chapter.title.replace(/^(#+)(?!\s)/, '$1 ').trim();
            const slug = `${rawTitle
              .toLowerCase()
              .replace(/[^\wа-яё\s-]/gi, '')
              .replace(/\s+/g, '-')}-${idx}`;

            return (
              <div key={slug} id={slug} style={{ marginTop: '3rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
                  {rawTitle}
                </ReactMarkdown>

                <ReactMarkdown
                  children={chapter.content}
                  remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeKatex, rehypeRaw, rehypePdfEmbedder, rehypeUniqueHeadingIds]}
                  unwrapDisallowed={true}
                  components={markdownComponents}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
