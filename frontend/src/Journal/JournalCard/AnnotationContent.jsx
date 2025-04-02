import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './JournalCard.module.scss';

function AnnotationContent({ markdown }) {
  const chapterPattern = /<!--\s*chapter:start=.*?-->([\s\S]*?)<!--\s*chapter:end=.*?-->/g;
  const cleanedMarkdown = markdown.replace(chapterPattern, '').trim();

  const annotationStartMarker = '<!-- annotation:start -->';
  const annotationEndMarker = '<!-- annotation:end -->';
  const keywordsStartMarker = '<!-- keywords:start -->';
  const keywordsEndMarker = '<!-- keywords:end -->';

  let annotationText = '';
  let keywordsText = '';
  let annotationIndex = -1;
  let keywordsIndex = -1;

  annotationIndex = cleanedMarkdown.indexOf(annotationStartMarker);
  if (annotationIndex !== -1) {
    const endIndex = cleanedMarkdown.indexOf(annotationEndMarker, annotationIndex);
    if (endIndex !== -1) {
      annotationText = cleanedMarkdown.substring(annotationIndex + annotationStartMarker.length, endIndex).trim();
    }
  }

  keywordsIndex = cleanedMarkdown.indexOf(keywordsStartMarker);
  if (keywordsIndex !== -1) {
    const endIndex = cleanedMarkdown.indexOf(keywordsEndMarker, keywordsIndex);
    if (endIndex !== -1) {
      keywordsText = cleanedMarkdown.substring(keywordsIndex + keywordsStartMarker.length, endIndex).trim();
    }
  }

  if (!annotationText && !keywordsText) {
    annotationText = cleanedMarkdown;
    annotationIndex = 0;
  }

  const blocks = [];
  if (keywordsText) {
    blocks.push({ type: 'keywords', content: keywordsText, index: keywordsIndex });
  }
  if (annotationText) {
    blocks.push({ type: 'annotation', content: annotationText, index: annotationIndex });
  }

  blocks.sort((a, b) => a.index - b.index);

  return (
    <div className={styles.annotationContainer}>
      {blocks.map((block, idx) =>
        block.type === 'keywords' ? (
          <div key={idx} className={styles.keywords}>
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        ) : (
          <div key={idx} className={styles.annotationText}>
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}

export default AnnotationContent;
