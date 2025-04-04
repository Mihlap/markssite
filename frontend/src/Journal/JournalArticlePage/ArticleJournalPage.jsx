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
  const hasBlockChild = flatChildren.some(
    (child) => child && typeof child === 'object' && (child.type === PDFEmbedComponent || child.type === MathBlock)
  );
  return hasBlockChild ? (
    <div {...props} className={styles.paragraph}>
      {children}
    </div>
  ) : (
    <p {...props} className={styles.paragraph}>
      {children}
    </p>
  );
};

const Heading1 = ({ children, ...props }) => (
  <h1 className={styles.heading1} {...props}>
    {children}
  </h1>
);
const Heading2 = ({ children, ...props }) => (
  <h2 className={styles.heading2} {...props}>
    {children}
  </h2>
);
const Heading3 = ({ children, ...props }) => (
  <h3 className={styles.heading3} {...props}>
    {children}
  </h3>
);
const Heading4 = ({ children, ...props }) => (
  <h4 className={styles.heading4} {...props}>
    {children}
  </h4>
);
const Heading5 = ({ children, ...props }) => (
  <h5 className={styles.heading5} {...props}>
    {children}
  </h5>
);
const Heading6 = ({ children, ...props }) => (
  <h6 className={styles.heading6} {...props}>
    {children}
  </h6>
);

const LinkComponent = ({ href, children, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link} {...props}>
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
  const { journal } = state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const markdownComponents = useMemo(
    () => ({
      h1: Heading1,
      h2: Heading2,
      h3: Heading3,
      h4: Heading4,
      h5: Heading5,
      h6: Heading6,
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

  if (!journal) {
    return <div className={styles.not_found}>Статья не найдена</div>;
  }

  return (
    <div className={styles.main_article_card}>
      <div className={styles.main_article_card__fon}>
          <div className={styles.all_button_div}>
            <AllArticlesButton path="/journalPage" />
          </div>
          <div className={styles.left_title}>{journal.title}</div>
          <div className={styles.title_text}>
            <strong>{journal.authors?.map((a) => a.name).join(', ')}</strong>
            <br />
            {journal.publication_date} • {journal.locations?.[0]?.name}
          </div>
        </div>
        <div className={styles.wrapper}>
        <ReactMarkdown
          children={journal.markdown_content}
          remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeKatex, rehypeRaw, rehypePdfEmbedder, rehypeUniqueHeadingIds]}
          unwrapDisallowed={true}
          className={styles.markdown_body}
          components={markdownComponents}
          />
          </div>
        </div>   
  );
}

export default ArticleJournalPage;
