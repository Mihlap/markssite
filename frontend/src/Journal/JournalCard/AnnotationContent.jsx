import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './JournalCard.module.scss';

function AnnotationContent({ markdown }) {
  const annotationStartMarker = '<!-- annotation:start -->';
  const annotationEndMarker = '<!-- annotation:end -->';
  const keywordsStartMarker = '<!-- keywords:start -->';
  const keywordsEndMarker = '<!-- keywords:end -->';

  let annotationText = '';
  let keywordsText = '';

  const annotationStartIndex = markdown.indexOf(annotationStartMarker);
  const annotationEndIndex = markdown.indexOf(annotationEndMarker);
  if (annotationStartIndex !== -1 && annotationEndIndex !== -1) {
    annotationText = markdown.substring(annotationStartIndex + annotationStartMarker.length, annotationEndIndex).trim();
  }

  const keywordsStartIndex = markdown.indexOf(keywordsStartMarker);
  const keywordsEndIndex = markdown.indexOf(keywordsEndMarker);
  if (keywordsStartIndex !== -1 && keywordsEndIndex !== -1) {
    keywordsText = markdown.substring(keywordsStartIndex + keywordsStartMarker.length, keywordsEndIndex).trim();
  }

  if (!annotationText && !keywordsText) {
    annotationText = markdown;
  }

  return (
    <div className={styles.annotationContainer}>
      {keywordsText && (
        <div className={styles.keywords}>
          <ReactMarkdown>{keywordsText}</ReactMarkdown>
        </div>
      )}
      {annotationText && (
        <div className={styles.annotationText}>
          <ReactMarkdown>{annotationText}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default AnnotationContent;
