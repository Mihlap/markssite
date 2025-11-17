import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypePdfEmbedder from '../../Add/add-articles/AddJournal/utils/rehypePdfEmbedder';
import rehypeUniqueHeadingIds from '../../Add/add-articles/AddJournal/utils/rehypeUniqueHeadingIds';
import { BlockMath, InlineMath } from 'react-katex';
import styles from './JournalCard.module.scss';

const markdownComponents = {
  p: ({ children, ...props }) => <p className={styles.annotationText} {...props}>{children}</p>,
  strong: ({ children, ...props }) => <strong {...props}>{children}</strong>,
  em: ({ children, ...props }) => <em {...props}>{children}</em>,
  del: ({ children, ...props }) => <del {...props}>{children}</del>,
  inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
  math: ({ value }) => <BlockMath>{value}</BlockMath>,
};

export default function AnnotationContent({ markdown }) {
  const chapterPattern = /<!--\s*chapter:start=.*?-->([\s\S]*?)<!--\s*chapter:end=.*?-->/g;
  const cleaned = markdown.replace(chapterPattern, (_, inner) => inner).trim();

  const annotationStart = '<!-- annotation:start -->';
  const annotationEnd   = '<!-- annotation:end -->';
  const keywordsStart   = '<!-- keywords:start -->';
  const keywordsEnd     = '<!-- keywords:end -->';

  let annotationText = '';
  const aStart = cleaned.indexOf(annotationStart);
  if (aStart !== -1) {
    const aEnd = cleaned.indexOf(annotationEnd, aStart + annotationStart.length);
    if (aEnd !== -1) {
      annotationText = cleaned
        .slice(aStart + annotationStart.length, aEnd)
        .trim();
    }
  }

  let keywordsText = '';
  const kStart = cleaned.indexOf(keywordsStart);
  if (kStart !== -1) {
    const kEnd = cleaned.indexOf(keywordsEnd, kStart + keywordsStart.length);
    if (kEnd !== -1) {
      keywordsText = cleaned
        .slice(kStart + keywordsStart.length, kEnd)
        .trim();
    }
  }

  const remarkPlugins = [remarkGfm, remarkMath, remarkBreaks];
  const rehypePlugins = [rehypeRaw, rehypeKatex, rehypePdfEmbedder, rehypeUniqueHeadingIds];

  return (
    <div className={styles.annotationContainer}>
      {keywordsText && (
        <div className={styles.keywords}>
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
          >
            {keywordsText}
          </ReactMarkdown>
        </div>
      )}

      {annotationText && (
        <div className={styles.annotationText}>
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
          >
            {annotationText}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
