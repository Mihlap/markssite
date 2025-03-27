import React, { useState } from 'react';
import styles from './JournalCard.module.scss';

import butt1 from '../icons/butt11.svg';
import butt2 from '../icons/butt22.svg';
import butt3 from '../icons/butt33.svg';

import cat1 from '../icons/cat1.svg';
import cat2 from '../icons/cat2.svg';
import cat3 from '../icons/cat3.svg';
import cat4 from '../icons/cat4.svg';
import cat5 from '../icons/cat5.svg';
import cat6 from '../icons/cat6.svg';

const TABS = {
  ARTICLE: 'Статья',
  ANNOTATION: 'Аннотация',
  CONTENT: 'Содержание',
};

const TAB_COLOR_SETS = [
  ['#1D2E43', '#75BBFD', '#FFFFFF'],
  ['#5385B6', '#FFFFFF', '#75BBFD'],
  ['#1D2E43', '#75BBFD', '#FFFFFF'],
  ['#75BBFD', '#FFFFFF', '#1D2E43'],
];

const catImages = [cat1, cat2, cat3, cat4, cat5, cat6];

// Функция, чтобы вернуть цвет текста для кнопки (если фон белый, делаем текст #1D2E43, иначе #FFFFFF)
const getButtonTextColor = (bgColor) => {
  return bgColor === '#FFFFFF' ? '#1D2E43' : '#FFFFFF';
};

function JournalCard({ journal, index }) {
  const [activeTab, setActiveTab] = useState(TABS.ARTICLE);

  // Получаем список авторов (не больше 6)
  const authors = journal?.authors || [];
  const authorsToDisplay = authors.slice(0, 6);

  // Из массива цветов достаём по три цвета: для «Статьи», «Аннотации» и «Содержания»
  const [articleColor, annotationColor, contentColor] = TAB_COLOR_SETS[index % TAB_COLOR_SETS.length];

  // Текущий цвет «обложки» (левой части) в зависимости от активного таба
  const currentCardColor =
    activeTab === TABS.ARTICLE ? articleColor : activeTab === TABS.ANNOTATION ? annotationColor : contentColor;

  // Проверяем, «светлый» ли цвет (например, чтобы определить обратные стили для обложки)
  const isInverted = currentCardColor === '#75BBFD';

  // Класс для сетки авторов (разное количество авторов = разное расположение)
  let authorsCountClass = '';
  if (authorsToDisplay.length <= 3) {
    authorsCountClass =
      authorsToDisplay.length === 1
        ? styles.journalCard__authorsGrid1
        : authorsToDisplay.length === 2
        ? styles.journalCard__authorsGrid2
        : styles.journalCard__authorsGrid3;
  } else {
    authorsCountClass = styles.journalCard__authorsGridTwoRows;
  }

  const getRandomCat = () => catImages[Math.floor(Math.random() * catImages.length)];

  // Для переключения визуальных стилей вкладок (если нужно)
  const activeTabClass =
    activeTab === TABS.ARTICLE
      ? styles.activeTab1
      : activeTab === TABS.ANNOTATION
      ? styles.activeTab2
      : styles.activeTab3;

  return (
    <div className={styles.journalCard}>
      {/* Левая часть (обложка) */}
      <div className={styles.journalCard__left} style={{ backgroundColor: currentCardColor }}>
        <div className={`${styles.journalCard__authorsGrid} ${authorsCountClass}`}>
          {authorsToDisplay.map((author, idx) => {
            const isFallback = !author.image;
            const imageSrc = author.image || getRandomCat();

            return (
              <div
                key={idx}
                className={`${styles.journalCard__authorWrapper} ${isInverted ? styles.inverted : ''}`}
                data-name={author.name}>
                <img
                  src={imageSrc}
                  alt={`Автор ${author.name}`}
                  className={`${styles.journalCard__authorImg} ${isFallback ? styles.fallbackIcon : ''}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getRandomCat();
                    e.target.classList.add(styles.fallbackIcon);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Правая часть (контент карточки) */}
      <div className={styles.journalCard__right}>
        {/* Блок вкладок (кнопок) */}
        <div className={`${styles.journalCard__tabs} ${activeTabClass}`}>
          <button
            className={`${styles.journalCard__tabBtn} ${styles.tabBtn1} ${
              activeTab === TABS.ARTICLE ? styles.active : ''
            }`}
            onClick={() => setActiveTab(TABS.ARTICLE)}
            style={{
              WebkitMask: `url(${butt1}) no-repeat center / contain`,
              mask: `url(${butt1}) no-repeat center / contain`,
              backgroundColor: articleColor,
              color: getButtonTextColor(articleColor),
            }}>
            Статья
          </button>

          <button
            className={`${styles.journalCard__tabBtn} ${styles.tabBtn2} ${
              activeTab === TABS.ANNOTATION ? styles.active : ''
            }`}
            onClick={() => setActiveTab(TABS.ANNOTATION)}
            style={{
              WebkitMask: `url(${butt2}) no-repeat center / contain`,
              mask: `url(${butt2}) no-repeat center / contain`,
              backgroundColor: annotationColor,
              color: getButtonTextColor(annotationColor),
            }}>
            Аннотация
          </button>

          <button
            className={`${styles.journalCard__tabBtn} ${styles.tabBtn3} ${
              activeTab === TABS.CONTENT ? styles.active : ''
            }`}
            onClick={() => setActiveTab(TABS.CONTENT)}
            style={{
              WebkitMask: `url(${butt3}) no-repeat center / contain`,
              mask: `url(${butt3}) no-repeat center / contain`,
              backgroundColor: contentColor,
              color: getButtonTextColor(contentColor),
            }}>
            Содержание
          </button>
        </div>

        {/* Контент активной вкладки */}
        <div className={styles.journalCard__content} style={{ backgroundColor: currentCardColor }}>
          {activeTab === TABS.ARTICLE && (
            <>
              <h3 className={styles.journalCard__title}>{journal.title}</h3>
              <div className={styles.journalCard__info}>
                <p>
                  {journal.organizations?.map((org) => org.value || org.name).join(', ')};{' '}
                  {journal.locations?.map((loc) => loc.value || loc.name).join(', ')}
                </p>
                <p>{journal.publication_date}</p>
              </div>
            </>
          )}

          {activeTab === TABS.ANNOTATION && (
            <div className={styles.journalCard__annotation}>{journal.annotation || 'Текст аннотации...'}</div>
          )}

          {activeTab === TABS.CONTENT && (
            <div className={styles.journalCard__contentSection}>{journal.content || 'Текст содержания...'}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalCard;
