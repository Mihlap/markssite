import React from 'react';
import Cover from './Cover/Cover';
import styles from './JournalMain.module.scss';
import CategoryFilters from './CategoryFilters/CategoryFilters';

function JournalMain() {
  return (
    <div className={styles.journalMain}>
      <Cover />
      <CategoryFilters />
    </div>
  );
}

export default JournalMain;