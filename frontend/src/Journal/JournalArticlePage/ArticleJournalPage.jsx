import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypePdfEmbedder from '../../Add/add-articles/AddJournal/utils/rehypePdfEmbedder';
import rehypeUniqueHeadingIds from '../../Add/add-articles/AddJournal/utils/rehypeUniqueHeadingIds';
import { BlockMath, InlineMath } from 'react-katex';
import styles from './ArticleJournalPage.module.scss';
import 'katex/dist/katex.min.css';
import AllArticlesButton from '../../UI/ButtonsArticles/AllArticlesButton';
import ArticleTableOfContents, { parseChapters } from './ArticleTableOfContents';

const InlineMathComponent = ({ value }) => <InlineMath>{value}</InlineMath>;

const PDFEmbedComponent = ({ src, title }) => (
  <div className={styles.pdfEmbed}>
    <iframe src={src} title={title} width="100%" height="350px" style={{ border: 'none' }} loading="lazy">
      Ваш браузер не поддерживает встраивание PDF.
    </iframe>
  </div>
);
PDFEmbedComponent.displayName = 'PDFEmbedComponent';

const MathBlock = ({ value }) => (
  <div className={styles.mathBlock}>
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
    React.createElement(`h${level}`, { ...props, className: styles[`heading${level}`] }, children);

const LinkComponent = ({ href, children, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props} className={styles.link}>
    {children}
  </a>
);

const Table = ({ children, ...props }) => (
  <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
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

function ArticleJournalPage() {
  const { state } = useLocation();
 const { journal, targetChapterSlug } = state || {};
 const md = journal?.markdown_content ?? '';

 const chapters = useMemo(() => {
    return parseChapters(md).map((ch, idx) => {
       const baseSlug = ch.title
         .toLowerCase()
         .replace(/[^\wа-яё\s-]/gi, '')
        .replace(/\s+/g, '-');
      const slug = `${baseSlug}-${idx}`;
      return { ...ch, slug };
    });
  }, [md]);

  const markdownComponents = useMemo(
    () => ({
      h1: Heading(1),
      h2: Heading(2),
      h3: Heading(3),
      h4: Heading(4),
      h5: Heading(5),
      h6: Heading(6),
      p: Paragraph,
      PDFEmbed: PDFEmbedComponent,
      math: MathBlock,
      inlineMath: InlineMathComponent,
      img: ({ src, alt }) => <img src={src} alt={alt} className={styles.item_img} loading="lazy" />,
      a: LinkComponent,
      table: Table,
      ul: List,
      ol: List,
      blockquote: BlockQuote,
      code: InlineCode,
      pre: CodeBlock,
    }),
    []
  );

  useEffect(() => {
    if (!journal) return;

    if (targetChapterSlug) {
      const el = document.getElementById(targetChapterSlug);
      if (el) {      
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState(null, '', `#${targetChapterSlug}`);       
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [journal, targetChapterSlug]);

  if (!journal) {
    return <div className={styles.not_found}>Статья не найдена</div>;
  }

  return (
    <div className={styles.main_article_card}>
      <div className={styles.main_article_card__fon}>
        <div className={styles.allButton_div}>
          <AllArticlesButton path="/journalPage" />
        </div>
        <div className={styles.left_title}>{journal.title}</div>
        <div className={styles.authorsNames}>
          {journal.authors?.map((a, idx) => (
            <React.Fragment key={idx}>
              <span className={styles.authorName}>{a.name}</span>
              {idx < journal.authors.length - 1 && <span className={styles.authorSeparator}>&nbsp;•&nbsp;</span>}
            </React.Fragment>
          ))}
        </div>
        <div className={styles.publication_date}>
          <span>{journal.organizations?.[0]?.value ?? journal.organizations?.[0]?.name}</span> •{' '}
          <span>{journal.publication_date}</span>
        </div>
      </div>

      <div className={styles.articleLayout}>
        <div className={styles.sidebar}>
          <ArticleTableOfContents markdown={md} activeSlug={targetChapterSlug} />
        </div>
        <div className={styles.wrapper}>
          <div className={styles.markdown_body}>
            {chapters.map((chapter) => (
              <div key={chapter.slug} id={chapter.slug} style={{ marginBottom: '2rem' }}>
                <h2>{chapter.title}</h2>
                <ReactMarkdown
                  children={chapter.content}
                  remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeKatex, rehypeRaw, rehypePdfEmbedder, rehypeUniqueHeadingIds]}
                  unwrapDisallowed={true}
                  components={markdownComponents}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleJournalPage;
