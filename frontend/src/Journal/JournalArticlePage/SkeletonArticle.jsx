import React from 'react';
import styles from './SkeletonArticle.module.scss';

export default function SkeletonArticle() {
  return (
    <div className={styles.skeleton}>
     <div className={`${styles.shimmer} ${styles.hero}`} />
      <div className={styles.header}>
        <div className={`${styles.shimmer} ${styles.button}`} />
        <div className={`${styles.shimmer} ${styles.title}`} />
        <div className={`${styles.shimmer} ${styles.authors}`} />
        <div className={`${styles.shimmer} ${styles.date}`} />
      </div>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${styles.shimmer} ${styles.sidebarLine}`} />
          ))}
        </div>
        <div className={styles.content}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${styles.shimmer} ${styles.line}`} />
          ))}
          <div className={`${styles.shimmer} ${styles.block}`} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`${styles.shimmer} ${styles.line}`} />
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.share}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.shimmer} ${styles.shareIcon}`} />
          ))}
        </div>
        <div className={styles.nav}>
          <div className={`${styles.shimmer} ${styles.navPrev}`} />
          <div className={`${styles.shimmer} ${styles.navNext}`} />
        </div>
      </div>
    </div>
  );
}
