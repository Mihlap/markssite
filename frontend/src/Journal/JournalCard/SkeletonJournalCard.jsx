import React from 'react';
import styles from './SkeletonJournalCard.module.scss';

export default function SkeletonJournalCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.leftBox} />
      <div className={styles.rightBox}>
        <div className={styles.titleLine} />
        <div className={styles.metaLine} />
        <div className={styles.tabBar}>
          <div className={styles.tab} />
          <div className={styles.tab} />
          <div className={styles.tab} />
        </div>
      </div>
    </div>
  );
}
