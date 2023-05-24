import React from 'react';
import styles from './AllProjectsButton.module.css'
// import previous from '../../icons/previous.svg';
// import next from '../../icons/next.svg'
import { Link } from 'react-router-dom';

const PreviousNextButton = () => {
  return (
    <div className={styles.button_project}>
      <Link className={styles.button_project_link}>
   <button className={`${styles.previous_svg} ${styles.button_project_button}`}>
  <svg className={styles.previous_svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="11.75" stroke="#1D2E43" strokeWidth="0.5"/>
<path d="M14 7L9 12L14 17" stroke="#1D2E43" strokeWidth="0.5"/>
</svg>
<span className={styles.previous_span}>Предыдущий проект</span>
    </button>
      </Link>
      <Link className={styles.button_project_link}>
    <button className={`${styles.next_svg} ${styles.button_project_button}`}>
            <span className={styles.next_span}>Следующий проект</span>
  <svg className={styles.next_svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="11.75" transform="rotate(-180 12 12)" stroke="#1D2E43" strokeWidth="0.5"/>
<path d="M10 17L15 12L10 7" stroke="#1D2E43" strokeWidth="0.5"/>
</svg>
    </button>
      </Link>
    </div>
  )
}

export default PreviousNextButton;

