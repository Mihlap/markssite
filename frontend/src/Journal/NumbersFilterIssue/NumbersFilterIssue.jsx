import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedIssueNumber } from '../../store/Slice/journalSlice';
import { ReactComponent as IssueNumberShape } from '../icons/IssueNumber.svg';
import styles from './NumbersFilterIssue.module.scss';

function NumbersFilterIssue() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const { selectedIssue } = useSelector((state) => state.categoryFilters.desktop);
  const uniqueIssues = [...new Set(journals.map((j) => j.issue_number))].sort((a, b) => a - b);
  const issues = uniqueIssues.map((num) => String(num).padStart(3, '0'));

  const handleIssueClick = (issue) => {
    if (selectedIssue === issue) {
      dispatch(setSelectedIssueNumber(null));
    } else {
      dispatch(setSelectedIssueNumber(issue));
    }
  };

  return (
    <div className={styles.numbersFilterIssue}>
      {issues.map((issue) => (
        <button
          key={issue}
          type="button"
          className={`${styles.issueButton} ${selectedIssue === issue ? styles.active : ''}`}
          onClick={() => handleIssueClick(issue)}>
          <span className={styles.issueText}>
          <IssueNumberShape className={styles.issueSvg} />
          </span>
          <span className={styles.marksText}>MARKS journal</span>
        </button>
      ))}
    </div>
  );
}

export default memo(NumbersFilterIssue);
