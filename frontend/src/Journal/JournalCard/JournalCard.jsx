import { useState } from 'react';
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
import AnnotationContent from './AnnotationContent';

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

const getButtonTextColor = (bgColor) => {
  return bgColor === '#FFFFFF' ? '#1D2E43' : '#FFFFFF';
};

function JournalCard({ journal, index }) {
  const [activeTab, setActiveTab] = useState(TABS.ARTICLE);
  const authors = journal?.authors || [];
  const authorsToDisplay = authors.slice(0, 6);

  const [articleColor, annotationColor, contentColor] = TAB_COLOR_SETS[index % TAB_COLOR_SETS.length];

  const currentCardColor =
    activeTab === TABS.ARTICLE ? articleColor : activeTab === TABS.ANNOTATION ? annotationColor : contentColor;
  
  const isInverted = currentCardColor === '#75BBFD';

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

  const activeTabClass =
    activeTab === TABS.ARTICLE
      ? styles.activeTab1
      : activeTab === TABS.ANNOTATION
      ? styles.activeTab2
      : styles.activeTab3;

  return (
    <div className={styles.journalCard}>
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

      <div className={styles.journalCard__right}>
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
            <span className={styles.tabText}>Статья</span>
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

        <div className={styles.journalCard__content} style={{ backgroundColor: currentCardColor }}>
          {activeTab === TABS.ARTICLE && (
            <>
              <div className={styles.journalCard__title}>{journal.title}</div>
              <p className={styles.journalCard__subtitle}>
                <span className={styles.subtitle__org}>
                  {journal.organizations?.[0]?.value || journal.organizations?.[0]?.name}
                </span>
                {journal.organizations?.[0] && (journal.locations?.[0] || journal.publication_date) && ' • '}
                <span className={styles.subtitle__location}>
                  {journal.locations?.[0]?.value || journal.locations?.[0]?.name}
                </span>
                {(journal.locations?.[0] || journal.organizations?.[0]) && journal.publication_date && ' • '}
                <span className={styles.subtitle__date}>{journal.publication_date}</span>
              </p>
            </>
          )}

          {activeTab === TABS.ANNOTATION && (
            <AnnotationContent markdown={journal.markdown_content || 'Текст аннотации...'} />
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
