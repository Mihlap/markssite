import React from 'react';
import styles from './SkeletonArticle.module.scss';

export default function SkeletonArticle() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.shimmer} ${styles.hero}`} />
      <div className={styles.contentLines}>    
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${styles.shimmer} ${styles.line}`} />
        ))}
        <div className={`${styles.shimmer} ${styles.block}`} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${styles.shimmer} ${styles.line}`} />
        ))}   
        <div className={`${styles.shimmer} ${styles.lineShort}`} />
      </div>
    </div>
  );
}
