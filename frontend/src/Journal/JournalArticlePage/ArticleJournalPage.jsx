import React, { useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypePdfEmbedder from '../../Add/add-articles/AddJournal/utils/rehypePdfEmbedder';
import rehypeUniqueHeadingIds from '../../Add/add-articles/AddJournal/utils/rehypeUniqueHeadingIds';
import { BlockMath, InlineMath } from 'react-katex';
import { fetchJournals } from '../../store/Slice/journalSlice';
import styles from './ArticleJournalPage.module.scss';
import 'katex/dist/katex.min.css';
import AllArticlesButton from '../../UI/ButtonsArticles/AllArticlesButton';
import ArticleTableOfContents, { parseChapters } from './ArticleTableOfContents';
import ArticleAuthors from './ArticleAuthors';
import { shareToVK, shareToTelegram } from './utils';

import next from '../../icons/next.svg';
import previous from '../../icons/previous.svg';
import SkeletonArticle from './SkeletonArticle';

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

function ArticleJournalPage({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { state } = useLocation();
  const { journal: stateJournal, targetChapterSlug } = state || {};
  const journals = useSelector((s) => s.journal.journals);
  const loading = useSelector((s) => s.journal.loading);

  useEffect(() => {
    if (journals.length === 0) {
      dispatch(fetchJournals());
    }
  }, [dispatch, journals.length]);

  const journalToUse = useMemo(() => {
    if (stateJournal) return stateJournal;
    return journals.find((j) => String(j.id) === String(id));
  }, [stateJournal, journals, id]);

  const { previousArticle, nextArticle } = useMemo(() => {
    const len = journals.length;
    const idx = journals.findIndex((j) => j.id === journalToUse?.id);
    if (idx === -1 || len < 2) {
      return { previousArticle: null, nextArticle: null };
    }
    return {
      previousArticle: journals[(idx - 1 + len) % len],
      nextArticle: journals[(idx + 1) % len],
    };
  }, [journals, journalToUse]);

  const mdContent = journalToUse?.markdown_content ?? '';

  const chapters = useMemo(() => {
    return parseChapters(mdContent).map((ch, idx) => {
      const baseSlug = ch.title
        .toLowerCase()
        .replace(/[^\wа-яё\s-]/gi, '')
        .replace(/\s+/g, '-');
      return { ...ch, slug: `${baseSlug}-${idx}` };
    });
  }, [mdContent]);

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
    if (!journalToUse) return;
    if (targetChapterSlug) {
      const el = document.getElementById(targetChapterSlug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${targetChapterSlug}`);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [journalToUse, targetChapterSlug]);

  if (loading || !journalToUse) {
    return <SkeletonArticle />;
  }

  return (
    <div className={styles.main_article_card}>
      <div className={styles.main_article_card__fon}>
        <div className={styles.allButton_div}>
          <AllArticlesButton path="/journalPage" />
        </div>
        <div className={styles.left_title}>{journalToUse.title}</div>
        <div className={styles.authorsNames}>
          {journalToUse.authors?.map((a, idx) => (
            <React.Fragment key={idx}>
              <span className={styles.authorName}>{a.name}</span>
              {idx < journalToUse.authors.length - 1 && <span className={styles.authorSeparator}>&nbsp;•&nbsp;</span>}
            </React.Fragment>
          ))}
        </div>
        <div className={styles.publication_date}>
          <span>{journalToUse.organizations?.[0]?.value ?? journalToUse.organizations?.[0]?.name}</span>
          {' • '}
          <span>{journalToUse.publication_date}</span>
        </div>
      </div>

      <div className={styles.articleLayout}>
        <div className={styles.sidebar}>
          <ArticleTableOfContents markdown={mdContent} activeSlug={targetChapterSlug} />
        </div>
        <div className={styles.wrapper}>
          <div className={styles.markdown_body}>
            {chapters.map((chapter) => {
                const rawTitle = chapter.title.replace(/^(#+)(?!\s)/, '$1 ').trim();
             return (
               <div key={chapter.slug} id={chapter.slug} style={{ marginTop: '3rem' }}>
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
          <div className={styles.share_article}>
            <div>Поделиться статьей</div>
            <div id="articles" className={styles.social_links_articleCard}>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToVK(journalToUse)}>
                <span className={styles.social_links_item} style={{ marginRight: '18px', color: '#FF7F6A' }}>
                  VK
                </span>
              </button>
              <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => {}}>
                <span className={styles.social_links_item} style={{ marginRight: '18px', color: '#FF7F6A' }}>
                  IG
                </span>
              </button>

              <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => {}}>
                <span className={styles.social_links_item} style={{ marginRight: '18px', color: '#FF7F6A' }}>
                  BE
                </span>
              </button>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToTelegram(journalToUse)}>
                <span className={styles.social_links_item} style={{ color: '#FF7F6A' }}>
                  TG
                </span>
              </button>
            </div>
          </div>
          <div className={styles.button_article_articleCard}>
            {previousArticle && (
              <Link
                to={`/journal/${previousArticle.id}`}
                className={styles.button_article_link_articleCard1}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className={styles.previous_svg_articleCard}>
                  <img src={previous} alt="«Предыдущая»" />
                  <span className={styles.previous__span_articleCard}>{previousArticle.title}</span>
                </div>
              </Link>
            )}

            {nextArticle && (
              <Link
                to={`/journal/${nextArticle.id}`}
                className={styles.button_article_link_articleCard2}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className={styles.next_svg_articleCard}>
                  <span className={styles.next__span_articleCard}>{nextArticle.title}</span>
                  <img src={next} alt="«Следующая»" />
                </div>
              </Link>
            )}
          </div>
        </div>
        {mdContent.trim()?.length > 0 && (
          <div className={styles.sidebar}>
            <ArticleAuthors authors={journalToUse.authors} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleJournalPage;
