import React, { memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedIssueNumber } from '../../store/Slice/journalSlice';
import styles from './NumbersFilterIssue.module.scss';
import { issueIcons } from './issueIcons';

function NumbersFilterIssue() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const selectedIssueNumber = useSelector((state) => state.journal.selectedIssueNumber);

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const uniqueIssues = [...new Set(journals.map((j) => j.issue_number))].sort((a, b) => a - b);
  const issues = uniqueIssues.map((num) => String(num).padStart(3, '0'));

  if (issues.length === 1 && issues[0] === '001') {
    return null;
  }

  const startDrag = (clientX) => {
    setIsDragging(true);
    setStartX(clientX - containerRef.current.offsetLeft);
    setScrollStart(containerRef.current.scrollLeft);
  };

  const duringDrag = (clientX) => {
    if (!isDragging) return;
    const x = clientX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollStart - walk;
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const onMouseDown = (e) => startDrag(e.pageX);
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    duringDrag(e.pageX);
  };

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    startDrag(touch.pageX);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    duringDrag(touch.pageX);
  };

  const onTouchEnd = () => endDrag();

  const handleIssueClick = (issue) => {
    if (selectedIssueNumber === issue) {
      dispatch(setSelectedIssueNumber(null));
    } else {
      dispatch(setSelectedIssueNumber(issue));
    }
  };

  return (
    <div
      className={styles.scrollWrapper}
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
      <div className={styles.numbersFilterIssue}>
        {issues.map((issue) => {
          const Icon = issueIcons[issue] || issueIcons['001'];
          const isActive = selectedIssueNumber === issue;

          return (
            <button
              key={issue}
              type="button"
              onClick={() => handleIssueClick(issue)}
              className={`${styles.issueButton} ${isActive ? styles.active : ''}`}>
              <span className={styles.issueText}>
                <Icon className={styles.issueSvg} />
              </span>
              <span className={styles.marksText}>MARKS journal</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(NumbersFilterIssue);
