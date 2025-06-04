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
  <div className={styles.pdfEmbed} style={{ marginTop: '1rem' }}>
    <iframe src={src} title={title} width="100%" height="350px" style={{ border: 'none' }} allowFullScreen />
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

function FigureWithCaption({ src, alt, captionMd }) {
  return (
    <>
      <img className={styles.image} src={src} alt={alt} />
      <div
        className={styles.figureCaption}
        style={{
          color: 'var(--gray-959DA6)',
          fontFamily: 'Raleway',
          fontSize: '0.875rem',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '1.25rem',
          marginTop: '1rem',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
        <ReactMarkdown
          children={captionMd.trim()}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            ol: ({ children, ...props }) => (
              <ol
                {...props}
                style={{
                  listStyleType: 'decimal',
                  listStylePosition: 'outside',
                  paddingLeft: '1.5rem',
                  margin: 0,
                }}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li {...props} style={{ marginBottom: '0.5rem' }}>
                {children}
              </li>
            ),
          }}
        />
      </div>
    </>
  );
}

function PDFWithCaption({ src, captionMd }) {
  return (
    <>
      <div className={styles.pdfEmbed} style={{ marginTop: '1rem' }}>
        <iframe src={src} title="PDF Document" width="100%" height="350px" style={{ border: 'none' }} allowFullScreen />
      </div>
      <div
        className={styles.figureCaption}
        style={{
          color: 'var(--gray-959DA6)',
          fontFamily: 'Raleway',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '1.25rem',
          marginTop: '0.5rem',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
        <ReactMarkdown
          children={captionMd.trim()}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            ol: ({ children, ...props }) => (
              <ol
                {...props}
                style={{
                  listStyleType: 'decimal',
                  listStylePosition: 'outside',
                  paddingLeft: '1.5rem',
                  margin: 0,
                }}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li {...props} style={{ marginBottom: '0.5rem' }}>
                {children}
              </li>
            ),
          }}
        />
      </div>
    </>
  );
}

function extractFigureWithCaption(md) {
  const re = /^!\[([^\]]*)\]\(([^)]+)\)\s*\n+([\s\S]+?)(?=\n{2,}|$)/m;
  const match = md.match(re);
  if (!match) return null;
  const [fullMatch, alt, src, captionMd] = match;
  const before = md.slice(0, match.index);
  const after = md.slice(match.index + fullMatch.length);
  return { alt, src, captionMd, before, after };
}

function ensureEmptyLineAfterMediaCaptions(md) {
  const figureWithCaptionRe = /(!\[[^\]]*\]\([^)]+\)\s*\n(?:[^\n]+\n?)+)(?!\n\n)/g;
  const pdfWithCaptionRe = /(\[[^\]]*\.pdf\]\([^)]+\)\s*\n(?:[^\n]+\n?)+)(?!\n\n)/g;

  function addNewlineAfter(match) {
    return match + '\n';
  }

  let result = md;

  result = result.replace(figureWithCaptionRe, addNewlineAfter);
  result = result.replace(pdfWithCaptionRe, addNewlineAfter);

  return result;
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
  const fixedMarkdown = ensureEmptyLineAfterMediaCaptions(markdown);

  const kwMatch = fixedMarkdown.match(keywordsRe);
  const annotationMatch = fixedMarkdown.match(annotationRe);

  let cleaned = fixedMarkdown;
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
    let last = 0;
    let m;
    while ((m = splitRe.exec(fixedMarkdown)) !== null) {
      if (m.index > last) {
        segs.push({ type: 'text', content: fixedMarkdown.slice(last, m.index) });
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
    if (last < fixedMarkdown.length) {
      segs.push({ type: 'text', content: fixedMarkdown.slice(last) });
    }
    return segs;
  }, [fixedMarkdown]);

  let chapterIndex = 0;

  const captionTextStyles = {
    color: 'var(--gray-959DA6)',
    fontFamily: 'Raleway',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '1.25rem',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  };

  return (
    <>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'text': {
            const fig = extractFigureWithCaption(seg.content);

            function extractPdfWithCaption(md) {
              const pdfRe = /^\[.*?\.pdf\]\((.*?\.pdf)\)\s*([\s\S]+)?/m;
              const match = md.match(pdfRe);
              if (!match) return null;
              const before = md.slice(0, match.index);
              const after = md.slice(match.index + match[0].length);
              return { src: match[1], captionMd: match[2] || '', before, after };
            }
            const pdf = !fig ? extractPdfWithCaption(seg.content) : null;

            if (fig) {
              return (
                <React.Fragment key={i}>
                  {fig.before && (
                    <ReactMarkdown
                      children={fig.before}
                      remarkPlugins={remarkPlugins}
                      rehypePlugins={rehypePlugins}
                      components={markdownComponents}
                    />
                  )}
                  <FigureWithCaption src={fig.src} alt={fig.alt} captionMd={fig.captionMd} />
                  {fig.after && (
                    <div style={captionTextStyles}>
                      <ReactMarkdown
                        children={fig.after}
                        remarkPlugins={remarkPlugins}
                        rehypePlugins={rehypePlugins}
                        components={markdownComponents}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            } else if (pdf) {
              return (
                <React.Fragment key={i}>
                  {pdf.before && (
                    <ReactMarkdown
                      children={pdf.before}
                      remarkPlugins={remarkPlugins}
                      rehypePlugins={rehypePlugins}
                      components={markdownComponents}
                    />
                  )}
                  <PDFWithCaption src={pdf.src} captionMd={pdf.captionMd} />
                  {pdf.after && (
                    <div style={captionTextStyles}>
                      <ReactMarkdown
                        children={pdf.after}
                        remarkPlugins={remarkPlugins}
                        rehypePlugins={rehypePlugins}
                        components={markdownComponents}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            }

            return (
              <ReactMarkdown
                key={i}
                children={seg.content}
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={markdownComponents}
              />
            );
          }

          case 'keywords':
            return (
              <div
                key={i}
                className={styles.keywordsSection}
                style={{ marginBottom: '1.5rem', scrollMarginTop: '2rem' }}>
                <ReactMarkdown
                  children={seg.content}
                  remarkPlugins={remarkPlugins}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                />
              </div>
            );

          case 'annotation': {
            const slug = makeSlug(seg.title, 0);
            return (
              <section key={i} id={slug} className={styles.annotationSection}>
                <ReactMarkdown
                  children={`${'#'.repeat(seg.level)} ${seg.title}\n\n${seg.content}`}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                />
              </section>
            );
          }

          case 'chapter-raw': {
            if (chapterIndex >= chapters.length) return null;
            const { slug, level, title, content } = chapters[chapterIndex++];

            const imageRe = /^!\[.*?\]\((.*?)\)\s*([\s\S]+)/;
            const pdfLinkRe = /^\[.*?\.pdf\]\((.*?\.pdf)\)\s*([\s\S]+)/;
            const embedPdfRe = /^<PDFEmbed\s+src="(.*?)".*?\/?>\s*([\s\S]+)/;

            let match = null;
            let mediaType = null;
            if ((match = content.match(imageRe))) {
              mediaType = 'image';
            } else if ((match = content.match(pdfLinkRe))) {
              mediaType = 'pdfLink';
            } else if ((match = content.match(embedPdfRe))) {
              mediaType = 'pdfEmbed';
            }

            const leading = match
              ? content.replace(mediaType === 'image' ? imageRe : mediaType === 'pdfLink' ? pdfLinkRe : embedPdfRe, '')
              : content;

            const fig = extractFigureWithCaption(leading.trim());

            if (fig) {
              return (
                <section key={slug} id={slug}>
                  <ReactMarkdown
                    children={`${'#'.repeat(level)} ${title}`}
                    remarkPlugins={remarkPlugins}
                    rehypePlugins={rehypePlugins}
                    components={markdownComponents}
                  />
                  {fig.before && (
                    <ReactMarkdown
                      children={fig.before}
                      remarkPlugins={remarkPlugins}
                      rehypePlugins={rehypePlugins}
                      components={markdownComponents}
                    />
                  )}
                  <FigureWithCaption src={fig.src} alt={fig.alt} captionMd={fig.captionMd} />
                  {fig.after && (
                    <div style={captionTextStyles}>
                      <ReactMarkdown
                        children={fig.after}
                        remarkPlugins={remarkPlugins}
                        rehypePlugins={rehypePlugins}
                        components={markdownComponents}
                      />
                    </div>
                  )}
                </section>
              );
            }
            if (mediaType === 'pdfLink') {
              return (
                <section key={slug} id={slug}>
                  <ReactMarkdown
                    children={`${'#'.repeat(level)} ${title}\n\n${leading}`}
                    remarkPlugins={remarkPlugins}
                    rehypePlugins={rehypePlugins}
                    components={markdownComponents}
                  />
                  <PDFEmbedComponent src={match[1]} title={title} />
                  <div
                    className={styles.figureCaption}
                    style={{
                      color: 'var(--gray-959DA6)',
                      fontFamily: 'Raleway',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      lineHeight: '1.25rem',
                      marginTop: '0.5rem',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}>
                    <ReactMarkdown
                      children={match[2].trim()}
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        ol: ({ children, ...props }) => (
                          <ol
                            {...props}
                            style={{
                              listStyleType: 'decimal',
                              listStylePosition: 'outside',
                              paddingLeft: '1.5rem',
                              margin: 0,
                            }}>
                            {children}
                          </ol>
                        ),
                        li: ({ children, ...props }) => (
                          <li {...props} style={{ marginBottom: '0.5rem' }}>
                            {children}
                          </li>
                        ),
                      }}
                    />
                  </div>
                </section>
              );
            }
            return (
              <section key={slug} id={slug}>
                <ReactMarkdown
                  children={`${'#'.repeat(level)} ${title}\n\n${leading}`}
                  remarkPlugins={remarkPlugins}
                  rehypePlugins={rehypePlugins}
                  components={markdownComponents}
                />
                {match && mediaType === 'image' && (
                  <div className={styles.figureBlock}>
                    <img className={styles.image} src={match[1]} alt={title} />
                    <div className={styles.figureCaption} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {(() => {
                        const raw = match[2].trim();
                        const caption = raw.replace(/^(\d+)\.\s*(.*)/gm, '$1. $2');
                        const md = '\n' + caption;
                        return (
                          <ReactMarkdown
                            children={md}
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              ol: ({ children, ...props }) => (
                                <ol
                                  {...props}
                                  style={{
                                    listStyleType: 'decimal',
                                    listStylePosition: 'outside',
                                    paddingLeft: '1.5rem',
                                    margin: 0,
                                  }}>
                                  {children}
                                </ol>
                              ),
                              li: ({ children, ...props }) => (
                                <li {...props} style={{ marginBottom: '0.5rem' }}>
                                  {children}
                                </li>
                              ),
                            }}
                          />
                        );
                      })()}
                    </div>
                  </div>
                )}
              </section>
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
}
