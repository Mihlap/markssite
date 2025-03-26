import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cover from './Cover/Cover';
import CategoryFilters from './CategoryFilters/CategoryFilters';
import NumbersFilterIssue from './NumbersFilterIssue/NumbersFilterIssue';
import JournalCard from './JournalCard/JournalCard';
import { fetchJournals } from '../store/Slice/journalSlice';

import styles from './JournalMain.module.scss';

function JournalMain() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const selectedIssueNumber = useSelector((state) => state.journal.selectedIssueNumber);
  // const loading = useSelector((state) => state.journal.loading);
  // const error = useSelector((state) => state.journal.error);

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  const filteredJournals = selectedIssueNumber
    ? journals.filter((journal) => {   
        const journalIssueStr = String(journal.issue_number).padStart(3, '0');
        return journalIssueStr === selectedIssueNumber;
      })
    : journals;

  // if (loading) return <p>Загрузка...</p>;
  // if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  return (
    <div className={styles.journalMain}>
      <Cover />
      <CategoryFilters />
      <NumbersFilterIssue />    
      {filteredJournals.map((journal) => (
        <JournalCard key={journal.id} journal={journal} />
      ))}
    </div>
  );
}

export default JournalMain;
