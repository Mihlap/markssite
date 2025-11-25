import React from 'react';
import PropTypes from 'prop-types';

import styles from './VacancyRequirements.module.scss';

export default function VacancyRequirements({ vacancy, variant = 'default' }) {
  const { experience, locationStaff, busyness, modeOperating } = vacancy || {};

  return (
    <div className={`${styles['vacancy-req']} ${styles[`vacancy-req__${variant}`]}`}>
      <div className={styles[`vacancy-req__${variant}__row`]}>
        <div className={styles['wrap']}>
          <p className={styles[`vacancy-req__${variant}__label`]}>Опыт&nbsp;работы:</p>
          <span className={styles[`vacancy-req__${variant}__value`]}>{experience}</span>
        </div>
      </div>

      <div className={styles[`vacancy-req__${variant}__row`]}>
        <div className={styles['wrap']}>
          <p className={styles[`vacancy-req__${variant}__label`]}>Локация:</p>
          <span className={styles[`vacancy-req__${variant}__value`]}>{locationStaff}</span>
        </div>
      </div>

      <div className={styles[`vacancy-req__${variant}__row`]}>
        <div className={styles['wrap']}>
          <p className={styles[`vacancy-req__${variant}__label`]}>Занятость:</p>
          <span className={styles[`vacancy-req__${variant}__value`]}>{busyness}</span>
        </div>
      </div>

      <div className={styles[`vacancy-req__${variant}__row`]}>
        <div className={styles['wrap']}>
          <p className={styles[`vacancy-req__${variant}__label`]}>Режим&nbsp;работы:</p>
          <span className={styles[`vacancy-req__${variant}__value`]}>{modeOperating}</span>
        </div>
      </div>
    </div>
  );
}

VacancyRequirements.propTypes = {
  vacancy: PropTypes.shape({
    experience: PropTypes.string,
    locationStaff: PropTypes.string,
    busyness: PropTypes.string,
    modeOperating: PropTypes.string,
  }),
  variant: PropTypes.oneOf(['default', 'compact']),
};
