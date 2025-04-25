import React from 'react';
import styles from './ArticleAuthors.module.scss';

export default function ArticleAuthors({ authors }) {
  if (!authors || authors.length === 0) return null;

  const authorsWithImage = authors.filter((author) => !!author.image);
  if (authorsWithImage.length === 0) return null;

  return (
    <div className={styles.authorWrapper}>
      {authorsWithImage.map((author, idx) => (
        <div key={idx} className={styles.authorCard}>
          <img src={author.image} alt={author.name} className={styles.authorImg} />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{author.name}</span>
            <span className={styles.authorLabel}>Автор статьи</span>
          </div>
        </div>
      ))}
    </div>
  );
}
