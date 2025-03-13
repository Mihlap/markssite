import React from 'react';
import styles from './Cover.module.scss';
import CURRENT_JOURNAL_NUMBER from '../icons/number001.svg';

function Cover() {
  return (
    <section className={styles.Cover}>
      <div className={styles.Cover__cover}>
        <div className={styles.Cover__overlay} style={{ backgroundImage: `url(${CURRENT_JOURNAL_NUMBER})` }}></div>
        <div className={styles.Cover__text}>
          <div className={styles.Cover__title}>MARKS JOURNAL</div>
          <div className={styles.Cover__subtitle}>Научный журнал</div>
        </div>
      </div>
    </section>
  );
}

export default Cover;

