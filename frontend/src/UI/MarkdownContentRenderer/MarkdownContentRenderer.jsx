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

const remarkPlugins = [remarkGfm, remarkMath, remarkBreaks];
const rehypePlugins = [rehypeRaw, rehypeKatex, rehypePdfEmbedder, rehypeUniqueHeadingIds];

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
  let res = [];
  React.Children.forEach(children, (c) => {
    if (React.isValidElement(c) && c.props?.children) {
      res.push(c);
      res = res.concat(flattenChildren(c.props.children));
    } else {
      res.push(c);
    }
  });
  return res;
};
const Paragraph = ({ children, ...props }) => {
  const flat = flattenChildren(children);
  const hasBlock = flat.some((c) => React.isValidElement(c) && (c.type === PDFEmbedComponent || c.type === MathBlock));
  return hasBlock ? (
    <div className={styles.paragraph} {...props}>
      {children}
    </div>
  ) : (
    <p className={styles.paragraph} {...props}>
      {children}
    </p>
  );
};

const keywordsRe = /<!--\s*keywords:start\s*-->([\s\S]*?)<!--\s*keywords:end\s*-->/;
const annotationRe =
  /<!--\s*chapter:start=(#+)?([^\s>][^>]*)\s*-->[\s\S]*?<!--\s*annotation:start\s*-->([\s\S]*?)<!--\s*annotation:end\s*-->/;
const chapterRe = /<!--\s*chapter:start=.*?-->[\s\S]*?<!--\s*chapter:end=.*?-->/;

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

const markdownComponents = {
  p: Paragraph,
  img: ({ src, alt }) => <img className={styles.image} src={src} alt={alt} />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className={styles.tableContainer}>
      <table className={styles.table}>{children}</table>
    </div>
  ),
  ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
  ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
  blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
  code: ({ inline, className, children }) =>
    inline ? (
      <code className={styles.inlineCode}>{children}</code>
    ) : (
      <pre className={styles.pre}>
        <code className={className}>{children}</code>
      </pre>
    ),
  math: MathBlock,
  inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
  PDFEmbed: PDFEmbedComponent,
  h1: ({ children }) => <h1 className={styles.heading1}>{children}</h1>,
  h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
  h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
  h4: ({ children }) => <h4 className={styles.heading4}>{children}</h4>,
  h5: ({ children }) => <h5 className={styles.heading5}>{children}</h5>,
  h6: ({ children }) => <h6 className={styles.heading6}>{children}</h6>,
};

export default function MarkdownContentRenderer({ markdown = '' }) {
  const kwMatch = markdown.match(keywordsRe);
  const annotationMatch = markdown.match(annotationRe);

  let cleaned = markdown;
  if (kwMatch) cleaned = cleaned.replace(kwMatch[0], '');
  if (annotationMatch) cleaned = cleaned.replace(annotationMatch[0], '');

  const rawChapters = useMemo(() => parseChapters(cleaned) || [], [cleaned]);
  const chapters = useMemo(
    () =>
      rawChapters.map((ch, idx) => {
        const titleRaw = ch.title.trim();
        const cleanT = titleRaw.replace(/^#+\s*/, '');
        const slug = makeSlug(cleanT, idx + (annotationMatch ? 1 : 0));
        return {
          slug,
          level: Math.min((ch.title.match(/^(#+)/) || ['#'])[0].length, 6),
          title: cleanT,
          content: ch.content.trim(),
        };
      }),
    [rawChapters, annotationMatch]
  );

  const segments = useMemo(() => {
    const splitRe = new RegExp(`(${keywordsRe.source})|(${annotationRe.source})|(${chapterRe.source})`, 'g');
    const segs = [];
    let last = 0,
      m;
    while ((m = splitRe.exec(markdown)) !== null) {
      if (m.index > last) {
        segs.push({ type: 'text', content: markdown.slice(last, m.index) });
      }
      const raw = m[0];
      if (keywordsRe.test(raw)) {
        const [, kw] = keywordsRe.exec(raw);
        segs.push({ type: 'keywords', content: kw.trim() });
      } else if (annotationRe.test(raw)) {
        const [, hashes, title, content] = annotationRe.exec(raw);
        segs.push({
          type: 'annotation',
          level: Math.min(hashes.length, 6),
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        segs.push({ type: 'chapter-raw' });
      }
      last = splitRe.lastIndex;
    }
    if (last < markdown.length) {
      segs.push({ type: 'text', content: markdown.slice(last) });
    }
    return segs;
  }, [markdown]);

  let chapterIndex = 0;
  return (
    <>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'text':
            return (
              <ReactMarkdown
                key={i}
                children={seg.content}
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={markdownComponents}
              />
            );
          case 'keywords':
            return (
              <div key={i} className={styles.keywordsSection} style={{ marginBottom: '1.5rem', scrollMarginTop: '2rem' }}>
                <ReactMarkdown
                  children={seg.content}
                  remarkPlugins={remarkPlugins}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                />
              </div>
            );
          case 'annotation':
            const aSlug = makeSlug(seg.title, 0);
            return (
              <section
                key={i}
                id={aSlug}
                className={styles.annotationSection}
                style={{ marginBottom: '1.5rem', scrollMarginTop: '2rem' }}>
                <ReactMarkdown
                  children={`${'#'.repeat(seg.level)} ${seg.title}\n\n${seg.content}`}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                />
              </section>
            );
          case 'chapter-raw':
            if (chapterIndex >= chapters.length) return null;
            const { slug, level, title, content } = chapters[chapterIndex++];
            const md = `${'#'.repeat(level)} ${title}\n\n${content}`;
            return (
              <section key={slug} id={slug} style={{ marginTop: '1.5rem', scrollMarginTop: '2rem' }}>
                <ReactMarkdown
                  children={md}
                  remarkPlugins={remarkPlugins}
                  rehypePlugins={rehypePlugins}
                  components={markdownComponents}
                />
              </section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
