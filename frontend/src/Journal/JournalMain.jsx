import React from 'react';
import Cover from './Cover/Cover';
import styles from './JournalMain.module.scss';
import CategoryFilters from './CategoryFilters/CategoryFilters';
import NumbersFilterIssue from './NumbersFilterIssue/NumbersFilterIssue';
// import JournalCard from './JournalCard/JournalCard';

// import { useSelector } from 'react-redux';

function JournalMain() {

  // const { journals } = useSelector((state) => state.journal);

 
  return (
    <div className={styles.journalMain}>
      <Cover />
      <CategoryFilters />
      <NumbersFilterIssue />
      {/* {journals.map((journal) => (
        <JournalCard key={journal.id} journal={journal} />
      ))} */}
    </div>
  );
}

export default JournalMain;