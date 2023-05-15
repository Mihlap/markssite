import React from 'react';
import styles from './AllProjectsButton.module.css'
import previous from '../../icons/previous.svg';
import next from '../../icons/next.svg'
import { Link } from 'react-router-dom';

const PreviousNextButton = () => {
  return (
    <div className={styles.button_project}>
      <Link className={styles.button_project_link}>
   <button className={styles.previous_svg}>
            <img className={styles.previous_img} src={previous} alt="" />
            <span className={styles.previous_span}>Предыдущий проект</span>
    </button>
      </Link>
      <Link className={styles.button_project_link}>
    <button className={styles.next_svg}>
            <span className={styles.next_span}>Следующий проект</span>
            <img src={next} alt="" />
    </button>
      </Link>
    </div>
  )
}

export default PreviousNextButton;