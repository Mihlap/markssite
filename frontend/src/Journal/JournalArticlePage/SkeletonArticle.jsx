import React from 'react';
import styles from './SkeletonArticle.module.scss';

export default function SkeletonArticle() {
  return (
    <div className={styles.skeleton}>
       <div className={styles.hero}>
        <div className={`${styles.shimmer} ${styles.button}`} />
        <div className={`${styles.shimmer} ${styles.title}`} />
        <div className={`${styles.shimmer} ${styles.authors}`} />
        <div className={`${styles.shimmer} ${styles.date}`} />
      </div>

      <div className={styles.articleLayout}>   
         <div className={styles.wrapper}>
          <div className={styles.content}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`${styles.shimmer} ${styles.line}`} />
            ))}
            <div className={`${styles.shimmer} ${styles.block}`} />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`${styles.shimmer} ${styles.line}`} />
            ))}
          </div>
          <div className={styles.footer}>         
            <div className={styles.nav}>
              <div className={`${styles.shimmer} ${styles.navPrev}`} />
              <div className={`${styles.shimmer} ${styles.navNext}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

