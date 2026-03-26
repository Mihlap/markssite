import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypePdfEmbedder from '../../Admin/articles/journal/utils/rehypePdfEmbedder';
import rehypeUniqueHeadingIds from '../../Admin/articles/journal/utils/rehypeUniqueHeadingIds';
import { BlockMath, InlineMath } from 'react-katex';
import { parseChapters } from '../../Journal/JournalArticlePage/ArticleTableOfContents';
import styles from '../../Journal/JournalArticlePage/ArticleJournalPage.module.scss';

const remarkPlugins = [remarkGfm, remarkMath, remarkBreaks];
const rehypePlugins = [rehypeRaw, [rehypeKatex, { strict: 'ignore' }], rehypePdfEmbedder, rehypeUniqueHeadingIds];

function ensureEmptyLineAfterMediaCaptions(md) {
  const figureWithCaptionRe = /(!\[[^\]]*\]\([^)]+\)\r?\n(?:[^\r?\n]+\r?\n?)+?)(?!\r?\n\r?\n)/g;
  const pdfWithCaptionRe = /(\[[^\]]*\.pdf\]\([^)]+\)\r?\n(?:[^\r?\n]+\r?\n?)+?)(?!\r?\n\r?\n)/g;
  const addNewlineAfter = (match) => match + '\n\n';
  let result = md;
  result = result.replace(figureWithCaptionRe, addNewlineAfter);
  result = result.replace(pdfWithCaptionRe, addNewlineAfter);
  return result;
}

const CaptionParagraph = ({ children }) => <p className={styles.paragraphCaption}>{children}</p>;

const CaptionList = ({ ordered, children }) =>
  ordered ? (
    <ol className={styles.orderedListCaption}>
      {React.Children.map(children, (li, idx) => (
        <li key={idx} className={styles.listItemCaption}>
          {li.props.children}
        </li>
      ))}
    </ol>
  ) : (
    <ul className={styles.listCaption}>
      {React.Children.map(children, (li, idx) => (
        <li key={idx} className={styles.listItemCaption}>
          {li.props.children}
        </li>
      ))}
    </ul>
  );

const captionComponents = {
  p: CaptionParagraph,
  ul: ({ children }) => <CaptionList ordered={false}>{children}</CaptionList>,
  ol: ({ children }) => <CaptionList ordered>{children}</CaptionList>,
  li: ({ children }) => <CaptionParagraph>{children}</CaptionParagraph>,
};

function escapeNumberedLines(captionMd) {
  return captionMd
    .split('\n')
    .map((line) => {
      return line.replace(/^(\s*)(\d+)\.(\s?)/, '$1$2\\.$3');
    })
    .join('\n');
}

function FigureWithCaption({ src, alt, captionMd }) {
  const escapedCaption = captionMd ? escapeNumberedLines(captionMd.trim()) : '';

  return (
    <div className={styles.figureBlock}>
      <img className={styles.image} src={src} alt={alt} />
      {escapedCaption && (
        <div className={styles.figureCaption}>
          <ReactMarkdown
            children={escapedCaption}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={captionComponents}
          />
        </div>
      )}
    </div>
  );
}

function PDFWithCaption({ src, captionMd }) {
  const escapedCaption = captionMd ? escapeNumberedLines(captionMd.trim()) : '';

  return (
    <div className={styles.figureBlock}>
      <div className={styles.pdfEmbed} style={{ marginTop: '1rem' }}>
        <iframe src={src} title="PDF Document" width="100%" height="350px" style={{ border: 'none' }} allowFullScreen />
      </div>
      {escapedCaption && (
        <div className={styles.figureCaption}>
          <ReactMarkdown
            children={escapedCaption}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={captionComponents}
          />
        </div>
      )}
    </div>
  );
}

const isNewBlockLine = (line) => {
  const t = line.trim();
  return /^!\[([^\]]*)\]\(([^)]+)\)$/.test(t) || /^\[([^\]]*\.pdf)\]\(([^)]+)\)$/.test(t);
};

function processContent(content) {
  const lines = content.split('\n');
  const blocks = [];
  let currentText = [];

  const flushText = () => {
    if (currentText.length) {
      blocks.push({ type: 'text', content: currentText.join('\n') });
      currentText = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushText();
      const alt = imageMatch[1];
      const src = imageMatch[2];
      const captionLines = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== '' && !isNewBlockLine(lines[j])) {
        captionLines.push(lines[j]);
        j++;
      }
      if (j < lines.length && lines[j].trim() === '') {
        i = j;
      } else {
        i = j - 1;
      }
      blocks.push({
        type: 'image',
        src,
        alt,
        captionMd: captionLines.join('\n').trim(),
      });
      continue;
    }

    const pdfMatch = trimmed.match(/^\[([^\]]*\.pdf)\]\(([^)]+)\)$/);
    if (pdfMatch) {
      flushText();
      const src = pdfMatch[2];
      const captionLines = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== '' && !isNewBlockLine(lines[j])) {
        captionLines.push(lines[j]);
        j++;
      }
      if (j < lines.length && lines[j].trim() === '') {
        i = j;
      } else {
        i = j - 1;
      }
      blocks.push({
        type: 'pdf',
        src,
        captionMd: captionLines.join('\n').trim(),
      });
      continue;
    }

    currentText.push(rawLine);
  }

  flushText();
  return blocks;
}

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

export default function MarkdownContentRenderer({ markdown = '' }) {
  const fixedMarkdown = useMemo(() => ensureEmptyLineAfterMediaCaptions(markdown), [markdown]);
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
    let lastIndex = 0;
    let m;
    while ((m = splitRe.exec(fixedMarkdown)) !== null) {
      if (m.index > lastIndex) {
        segs.push({ type: 'text', content: fixedMarkdown.slice(lastIndex, m.index) });
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
      lastIndex = splitRe.lastIndex;
    }
    if (lastIndex < fixedMarkdown.length) {
      segs.push({ type: 'text', content: fixedMarkdown.slice(lastIndex) });
    }
    return segs;
  }, [fixedMarkdown]);

  let chapterIndex = 0;

  return (
    <>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'text': {
            const blocks = processContent(seg.content);
            return (
              <React.Fragment key={`text-seg-${i}`}>
                {blocks.map((b, idx) => {
                  if (b.type === 'text') {
                    return (
                      <ReactMarkdown
                        key={`text-${i}-${idx}`}
                        children={b.content}
                        remarkPlugins={remarkGfm ? [remarkGfm, remarkBreaks, remarkMath] : [remarkGfm, remarkBreaks]}
                        rehypePlugins={rehypePlugins}
                        components={{
                          p: ({ children, ...props }) => (
                            <p className={styles.paragraph} {...props}>
                              {children}
                            </p>
                          ),
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
                          blockquote: ({ children }) => (
                            <blockquote className={styles.blockquote}>{children}</blockquote>
                          ),
                          code: ({ inline, className, children }) =>
                            inline ? (
                              <code className={styles.inlineCode}>{children}</code>
                            ) : (
                              <pre className={styles.pre}>
                                <code className={className}>{children}</code>
                              </pre>
                            ),
                          math: ({ value }) => (
                            <div className={styles.mathBlock}>
                              <BlockMath strict="ignore">{value}</BlockMath>
                            </div>
                          ),
                          inlineMath: ({ value }) => <InlineMath strict="ignore">{value}</InlineMath>,
                          PDFEmbed: ({ src, title }) => (
                            <div className={styles.pdfEmbed} style={{ marginTop: '1rem' }}>
                              <iframe
                                src={src}
                                title={title}
                                width="100%"
                                height="350px"
                                style={{ border: 'none' }}
                                allowFullScreen
                              />
                            </div>
                          ),
                          h1: ({ children }) => <h1 className={styles.heading1}>{children}</h1>,
                          h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
                          h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
                          h4: ({ children }) => <h4 className={styles.heading4}>{children}</h4>,
                          h5: ({ children }) => <h5 className={styles.heading5}>{children}</h5>,
                          h6: ({ children }) => <h6 className={styles.heading6}>{children}</h6>,
                        }}
                      />
                    );
                  }
                  if (b.type === 'image') {
                    return (
                      <FigureWithCaption key={`img-${i}-${idx}`} src={b.src} alt={b.alt} captionMd={b.captionMd} />
                    );
                  }
                  if (b.type === 'pdf') {
                    return <PDFWithCaption key={`pdf-${i}-${idx}`} src={b.src} captionMd={b.captionMd} />;
                  }
                  return null;
                })}
              </React.Fragment>
            );
          }

          case 'keywords':
            return (
              <div
                key={`keywords-${i}`}
                className={styles.keywordsSection}
                style={{ marginBottom: '1.5rem', scrollMarginTop: '2rem' }}>
                <ReactMarkdown
                  children={seg.content}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children, ...props }) => (
                      <p className={styles.paragraph} {...props}>
                        {children}
                      </p>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {children}
                      </a>
                    ),
                  }}
                />
              </div>
            );

          case 'annotation': {
            const slug = makeSlug(seg.title, 0);
            return (
              <section key={`annot-${i}`} id={slug} className={styles.annotationSection}>
                <ReactMarkdown
                  children={`${'#'.repeat(seg.level)} ${seg.title}\n\n${seg.content}`}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children, ...props }) => (
                      <p className={styles.paragraph} {...props}>
                        {children}
                      </p>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {children}
                      </a>
                    ),
                  }}
                />
              </section>
            );
          }

          case 'chapter-raw': {
            if (chapterIndex >= chapters.length) return null;
            const { slug, level, title, content } = chapters[chapterIndex++];
            return (
              <section key={`chap-${slug}`} id={slug}>
                <ReactMarkdown
                  children={`${'#'.repeat(level)} ${title}`}
                  remarkPlugins={remarkPlugins}
                  rehypePlugins={rehypePlugins}
                  components={{
                    p: ({ children, ...props }) => (
                      <p className={styles.paragraph} {...props}>
                        {children}
                      </p>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {children}
                      </a>
                    ),
                    img: ({ src, alt }) => <img className={styles.image} src={src} alt={alt} />,
                  }}
                />
                {processContent(content).map((b, idx) => {
                  if (b.type === 'text') {
                    return (
                      <ReactMarkdown
                        key={`chap-text-${slug}-${idx}`}
                        children={b.content}
                        remarkPlugins={remarkGfm ? [remarkGfm, remarkBreaks, remarkMath] : [remarkGfm, remarkBreaks]}
                        rehypePlugins={rehypePlugins}
                        components={{
                          p: ({ children, ...props }) => (
                            <p className={styles.paragraph} {...props}>
                              {children}
                            </p>
                          ),
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                              {children}
                            </a>
                          ),
                          img: ({ src, alt }) => <img className={styles.image} src={src} alt={alt} loading="lazy" />,
                          table: ({ children }) => (
                            <div className={styles.tableContainer}>
                              <table className={styles.table}>{children}</table>
                            </div>
                          ),
                          ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
                          ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
                          blockquote: ({ children }) => (
                            <blockquote className={styles.blockquote}>{children}</blockquote>
                          ),
                          code: ({ inline, className, children }) =>
                            inline ? (
                              <code className={styles.inlineCode}>{children}</code>
                            ) : (
                              <pre className={styles.pre}>
                                <code className={className}>{children}</code>
                              </pre>
                            ),
                          math: ({ value }) => (
                            <div className={styles.mathBlock}>
                              <BlockMath strict="ignore">{value}</BlockMath>
                            </div>
                          ),
                          inlineMath: ({ value }) => <InlineMath strict="ignore">{value}</InlineMath>,
                          PDFEmbed: ({ src, title }) => (
                            <div className={styles.pdfEmbed} style={{ marginTop: '1rem' }}>
                              <iframe
                                src={src}
                                title={title}
                                width="100%"
                                height="350px"
                                style={{ border: 'none' }}
                                allowFullScreen
                              />
                            </div>
                          ),
                          h1: ({ children }) => <h1 className={styles.heading1}>{children}</h1>,
                          h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
                          h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
                          h4: ({ children }) => <h4 className={styles.heading4}>{children}</h4>,
                          h5: ({ children }) => <h5 className={styles.heading5}>{children}</h5>,
                          h6: ({ children }) => <h6 className={styles.heading6}>{children}</h6>,
                        }}
                      />
                    );
                  }
                  if (b.type === 'image') {
                    return (
                      <FigureWithCaption
                        key={`chap-img-${slug}-${idx}`}
                        src={b.src}
                        alt={b.alt}
                        captionMd={b.captionMd}
                      />
                    );
                  }
                  if (b.type === 'pdf') {
                    return <PDFWithCaption key={`chap-pdf-${slug}-${idx}`} src={b.src} captionMd={b.captionMd} />;
                  }
                  return null;
                })}
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
