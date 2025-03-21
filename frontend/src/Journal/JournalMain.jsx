import React from 'react';
import Cover from './Cover/Cover';
import styles from './JournalMain.module.scss';
import CategoryFilters from './CategoryFilters/CategoryFilters';
import NumbersFilterIssue from './NumbersFilterIssue/NumbersFilterIssue';

function JournalMain() {
  return (
    <div className={styles.journalMain}>
      <Cover />
      <CategoryFilters />
      <NumbersFilterIssue />
    </div>
  );
}

export default JournalMain;