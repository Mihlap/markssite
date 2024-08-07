import React from 'react';
import styles from './VacanciesInvite.module.scss';
import ButtonLink from '../ButtonLink/ButtonLink';
import StarsBack from '../StarsBack/StarsBack';

import invite_1 from '../icons/invite-1.png';
import invite_2 from '../icons/invite-2.png';

const VacanciesInvite = () => {
  return (
    <>
      <section className={styles.VacanciesInvite}>
        <StarsBack section="VacanciesInvite" styles={styles} />
        <div className={styles.VacanciesInvite__container}>
          <h2 className={styles.VacanciesInvite__title}>
            Приглашаем студентов<br></br> на&nbsp;стажировку
          </h2>
          <div className={styles.VacanciesInvite__content}>
            <div className={styles.VacanciesInvite__photos}>
              <img src={invite_1} alt=""></img>
              <img src={invite_2} alt=""></img>
              <img src={invite_1} alt=""></img>
              <img src={invite_2} alt=""></img>
              <span></span>
            </div>
            <div className={styles.VacanciesInvite__desc}>
              Оплачиваемая стажировка.<br></br> Сотрудничаем с&nbsp;ВУЗами, даем возможность{' '}
              <span>учиться у&nbsp;профессионалов</span> в&nbsp;сфере проектирования!
            </div>
            <ButtonLink text="Смотреть стажировки" to="/portal/internships" />
          </div>
        </div>
      </section>
    </>
  );
};

export default VacanciesInvite;
