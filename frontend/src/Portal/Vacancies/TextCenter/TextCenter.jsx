import React from 'react';
import styles from './TextCenter.module.scss';

import StarsBack from '../StarsBack/StarsBack';

const TextCenter = () => {
  return (
    <>
      <section className={styles.TextCenter}>
        <StarsBack section="TextCenter" styles={styles} />
        <div className={styles.TextCenter__text}>
          Мы&nbsp;верим, <span>что будущее строится сегодня,</span> и&nbsp;каждый наш проект&nbsp;<br></br>&mdash;
          это&nbsp;<span>возможность</span> проявляться, <br></br>а&nbsp;также <span>вдохновлять</span> и&nbsp;
          <span>преображать</span> окружающий мир
        </div>
      </section>
    </>
  );
};

export default TextCenter;
