import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypePdfEmbedder from '../../Add/add-articles/AddJournal/utils/rehypePdfEmbedder';
import rehypeUniqueHeadingIds from '../../Add/add-articles/AddJournal/utils/rehypeUniqueHeadingIds';
import { BlockMath, InlineMath } from 'react-katex';
import { parseChapters } from '../../Journal/JournalArticlePage/ArticleTableOfContents';
import styles from '../../Journal/JournalArticlePage/ArticleJournalPage.module.scss';

const annotationRe =
  /<!--\s*chapter:start=(#+)?([^\s>][^>]*)\s*-->[\s\S]*?<!--\s*annotation:start\s*-->([\s\S]*?)<!--\s*annotation:end\s*-->(?:[\s\S]*?<!--\s*chapter:end=.*?-->)/;

function makeSlug(title, idx) {
  return (
    title
      .toLowerCase()
      .replace(/^#+\s*/, '')
      .replace(/[^\wа-яё\s-]/gi, '')
      .trim()
      .replace(/\s+/g, '-') + `-${idx}`
  );
}

const PDFEmbedComponent = ({ src, title }) => (
  <div className={styles.pdfEmbed}>
    <iframe src={src} title={title} width="100%" height="350px" style={{ border: 'none' }} />
  </div>
);
const MathBlock = ({ value }) => (
  <div className={styles.mathBlock}>
    <BlockMath>{value}</BlockMath>
  </div>
);

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
const Paragraph = ({ children, ...props }) => {
  const flat = flattenChildren(children);
  const hasBlock = flat.some(
    (c) => c && typeof c === 'object' && (c.type === PDFEmbedComponent || c.type === MathBlock)
  );
  return hasBlock ? (
    <div {...props} className={styles.paragraph}>
      {children}
    </div>
  ) : (
    <p {...props} className={styles.paragraph}>
      {children}
    </p>
  );
};
const Heading =
  (level) =>
  ({ children, ...props }) =>
    React.createElement(`h${level}`, { className: styles[`heading${level}`], ...props }, children);
const LinkComponent = ({ href, children, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link} {...props}>
    {children}
  </a>
);
const Table = ({ children, ...props }) => (
  <div className={styles.tableContainer}>
    <table className={styles.table} {...props}>
      {children}
    </table>
  </div>
);
const List = ({ ordered, children, ...props }) =>
  ordered ? (
    <ol className={styles.list} {...props}>
      {children}
    </ol>
  ) : (
    <ul className={styles.list} {...props}>
      {children}
    </ul>
  );
const BlockQuote = ({ children, ...props }) => (
  <blockquote className={styles.blockquote} {...props}>
    {children}
  </blockquote>
);
const InlineCode = ({ children, ...props }) => (
  <code className={styles.inlineCode} {...props}>
    {children}
  </code>
);
const CodeBlock = ({ children, ...props }) => (
  <pre className={styles.pre} {...props}>
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
  img: ({ src, alt }) => <img src={src} alt={alt} className={styles.image} />,
  a: LinkComponent,
  table: Table,
  ul: List,
  ol: List,
  blockquote: BlockQuote,
  code: InlineCode,
  pre: CodeBlock,
  strong: ({ children, ...props }) => <strong {...props}>{children}</strong>,
  em: ({ children, ...props }) => <em {...props}>{children}</em>,
  del: ({ children, ...props }) => <del {...props}>{children}</del>,
};

export default function MarkdownContentRenderer({ markdown = '' }) {
  const remarkPlugins = [remarkGfm, remarkMath, remarkBreaks];
  const rehypePlugins = [rehypeRaw, rehypeKatex, rehypePdfEmbedder, rehypeUniqueHeadingIds];

  const kwMatch = markdown.match(/<!--\s*keywords:start\s*-->([\s\S]*?)<!--\s*keywords:end\s*-->/);
  const annotationMatch = markdown.match(annotationRe);
  
  let cleaned = markdown;
  if (kwMatch) cleaned = cleaned.replace(kwMatch[0], '');
  if (annotationMatch) cleaned = cleaned.replace(annotationMatch[0], '');

  const chapters = useMemo(() => {
    const raw = parseChapters(cleaned) || [];
    return raw.map((ch, idx) => {
      const titleRaw = ch.title.trim();
      const cleanTitle = titleRaw.replace(/^#+\s*/, '');
      const slug = makeSlug(cleanTitle, idx + (annotationMatch ? 1 : 0));
      return { slug, titleRaw, content: ch.content.trim() };
    });
  }, [cleaned, annotationMatch]);

  return (
    <>
      {/* Аннотация */}
      {annotationMatch &&
        (() => {
          const hashPart = annotationMatch[1] || '#';
          const rawTitle = annotationMatch[2].trim();
          const content = annotationMatch[3].trim();
          const level = Math.min(hashPart.length, 6);
        // const slug = rawTitle.toLowerCase().replace(/\s+/g, '-') + '-annotation';
        const slug = makeSlug(rawTitle, 0);

          return (
            <section
              id={slug}
              className={styles.annotationSection}
              style={{ marginBottom: '2rem', scrollMarginTop: '2rem' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}>
                {`${'#'.repeat(level)} ${rawTitle}\n\n${content}`}
              </ReactMarkdown>
            </section>
          );
        })()}

      {/* Ключевые слова */}
      {kwMatch && (
        <div className={styles.keywordsSection} style={{ marginBottom: '2rem', scrollMarginTop: '2rem' }}>
          <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypeRaw} components={markdownComponents}>
            {kwMatch[1].trim()}
          </ReactMarkdown>
        </div>
      )}

      {/* Обычные главы */}
      {chapters.map(({ slug, titleRaw, content }) => {
        const match = titleRaw.match(/^(#+)?\s*(.+)$/);
        const hashPart = (match && match[1]) || '##';
        const cleanTitle = match ? match[2] : titleRaw;
        const level = Math.min(hashPart.length, 6);

        return (
          <section key={slug} id={slug} style={{ marginTop: '2rem', scrollMarginTop: '2rem' }}>
            {/* Заголовок */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}>
              {`${'#'.repeat(level)} ${cleanTitle}`}
            </ReactMarkdown>
            {/* Контент */}
            <ReactMarkdown
              children={content}
              remarkPlugins={remarkPlugins}
              rehypePlugins={rehypePlugins}
              components={markdownComponents}
            />
          </section>
        );
      })}
    </>
  );
}
