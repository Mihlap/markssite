import React, { useLayoutEffect, useRef } from 'react';

import StarsBack from '../StarsBack/StarsBack';

import styles from './BenefitsGrid.module.scss';

import benefit_1 from '../icons/benefit-1.svg';
import benefit_2 from '../icons/benefit-2.svg';
import benefit_3 from '../icons/benefit-3.svg';
import benefit_4 from '../icons/benefit-4.svg';
import benefit_5 from '../icons/benefit-5.svg';
import benefit_6 from '../icons/benefit-6.svg';

const benefitsArray = [
  {
    icon: benefit_1,
    title: 'Мы за развитие команды',
    desc: 'Регулярные внутренние и&nbsp;внешние обучения, корпоративная скидка на&nbsp;Skyeng, внутреннее обучение английскому языку',
  },
  {
    icon: benefit_2,
    title: 'Свобода выбора и мышления',
    desc: 'Ценим идеи наших сотрудников, поощряем инициативность',
  },
  {
    icon: benefit_3,
    title: 'Международное проектирование',
    desc: 'Создаем уникальные объекты по&nbsp;всей России и&nbsp;миру',
  },
  {
    icon: benefit_4,
    title: 'Заботимся о здоровье',
    desc: 'Расширенный ДМС, страхование жизни',
  },
  {
    icon: benefit_5,
    title: 'Корпоративный спорт',
    desc: 'Футбол, баскетбол, настольный теннис, волейбол, йога, шахматы, велоспорт, бег, Гонки героев',
  },
  {
    icon: benefit_6,
    title: 'Весело отрывемся',
    desc: 'Корпоративные мероприятия, ежегодный сплав',
  },
];

const BenefitsGrid = () => {
  return (
    <section className={styles.BenefitsGrid}>
      <h2 className={styles.BenefitsGrid__title}>Преимущества работы с нами</h2>
      <StarsBack section="BenefitsGrid" styles={styles} />
      <ul className={styles.BenefitsGrid__items}>
        {benefitsArray.map((item, index) => {
          return (
            <li className={styles.BenefitsGrid__item} key={index}>
              <div className={styles.BenefitsGrid__icon}>
                <img src={item.icon} alt="" />
              </div>
              <div className={styles.BenefitsGrid__text}>
                <h3>{item.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: item.desc }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BenefitsGrid;
