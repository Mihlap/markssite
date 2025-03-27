import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournals } from '../store/Slice/journalSlice';
import Cover from './Cover/Cover';
import CategoryFilters from './CategoryFilters/CategoryFilters';
import NumbersFilterIssue from './NumbersFilterIssue/NumbersFilterIssue';
import JournalCard from './JournalCard/JournalCard';
import styles from './JournalMain.module.scss';

function JournalMain() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const selectedIssueNumber = useSelector((state) => state.journal.selectedIssueNumber);

  const isDesktop = window.innerWidth > 1024;

  const { selectedCategories: desktopSelectedCategories = [], searchValue: desktopSearchValue = '' } = useSelector(
    (state) => state.categoryFilters.desktop
  );

  const { selectedCategories: mobileSelectedCategories = [], searchValue: mobileSearchValue = '' } = useSelector(
    (state) => state.categoryFilters.mobile
  );

  const selectedCategories = isDesktop ? desktopSelectedCategories : mobileSelectedCategories;
  const searchValue = isDesktop ? desktopSearchValue : mobileSearchValue;

  useEffect(() => {
    if (!journals || journals.length === 0) {
      dispatch(fetchJournals());
    }
  }, [dispatch, journals]);

  const filteredJournals = useMemo(() => {
    let result = journals;

    if (selectedIssueNumber) {
      result = result.filter((journal) => {
        const issueStr = String(journal.issue_number).padStart(3, '0');
        return issueStr === selectedIssueNumber;
      });
    }

    if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
      result = result.filter((journal) => {
        const journalCats = journal.category || [];
        return journalCats.some((cat) => selectedCategories.includes(cat));
      });
    }

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      result = result.filter((journal) => journal.title.toLowerCase().includes(query));
    }

    return result;
  }, [journals, selectedIssueNumber, selectedCategories, searchValue]);

  const loading = useSelector((state) => state.journal.loading);
  const error = useSelector((state) => state.journal.error);
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  return (
    <div className={styles.journalMain}>
      <Cover />
      <CategoryFilters />
      <NumbersFilterIssue />
      {filteredJournals.map((journal, index) => (
        <JournalCard key={journal.id} journal={journal} index={index} />
      ))}
    </div>
  );
}

export default JournalMain;
