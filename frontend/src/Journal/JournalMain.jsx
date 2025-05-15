import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { fetchJournals } from '../store/Slice/journalSlice';
import Cover from './Cover/Cover';
import CategoryFilters from './CategoryFilters/CategoryFilters';
import NumbersFilterIssue from './NumbersFilterIssue/NumbersFilterIssue';
import JournalCard from './JournalCard/JournalCard';
import SkeletonJournalCard from './JournalCard/SkeletonJournalCard';
import styles from './JournalMain.module.scss';

function JournalMain() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals, shallowEqual);
  const loading = useSelector((state) => state.journal.loading, shallowEqual);
  const error = useSelector((state) => state.journal.error, shallowEqual);
  const selectedIssueNumber = useSelector((state) => state.journal.selectedIssueNumber, shallowEqual);
  const hasFetchedRef = useRef(false);

  const isDesktop = window.innerWidth > 1024;
  const desktopSelectedCategories = useSelector(
    (state) => state.categoryFilters.desktop.selectedCategories,
    shallowEqual
  );
  const desktopSearchValue = useSelector((state) => state.categoryFilters.desktop.searchValue, shallowEqual);
  const mobileSelectedCategories = useSelector(
    (state) => state.categoryFilters.mobile.selectedCategories,
    shallowEqual
  );
  const mobileSearchValue = useSelector((state) => state.categoryFilters.mobile.searchValue, shallowEqual);

  const selectedCategories = isDesktop ? desktopSelectedCategories : mobileSelectedCategories;
  const searchValue = isDesktop ? desktopSearchValue : mobileSearchValue;

  useEffect(() => {
    if (!hasFetchedRef.current && journals.length === 0) {
      hasFetchedRef.current = true;
      dispatch(fetchJournals());
    }
  }, [dispatch, journals.length]);

  const filteredJournals = useMemo(() => {
    let result = journals;

    if (selectedIssueNumber) {
      result = result.filter((j) => String(j.issue_number).padStart(3, '0') === selectedIssueNumber);
    }
    if (selectedCategories?.length) {
      result = result.filter((j) => (j.category || []).some((cat) => selectedCategories.includes(cat)));
    }
    if (searchValue?.trim()) {
      const q = searchValue.toLowerCase();
      result = result.filter((j) => j.title.toLowerCase().includes(q));
    }

    return result;
  }, [journals, selectedIssueNumber, selectedCategories, searchValue]);

  if (loading)
    return (
      <div className={styles.journalMain}>
        <Cover />
        <CategoryFilters />
        <NumbersFilterIssue />
        <div className={styles.journalCardsContainer}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonJournalCard key={i} />
          ))}
        </div>
      </div>
    );

  if (error) return <p className={styles.error}>Ошибка: {error}</p>;
  // if (filteredJournals.length === 0)
  //   return (
  //     <div className={styles.emptyState}>
  //       <p className={styles.noJournalsMessage}>Готовьтесь! Скоро то, о чем все говорят…</p>
  //     </div>
  //   );

  return (
    <div className={styles.journalMain}>
      <Cover />
      <CategoryFilters />
      <NumbersFilterIssue />
      <div className={styles.journalCardsContainer}>
        {filteredJournals.map((journal, idx) => (
          <JournalCard key={journal.id} journal={journal} index={idx} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(JournalMain);
