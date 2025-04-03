import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnotationContent from './AnnotationContent';
import ContentSection from './ContentSection';
import styles from './JournalCard.module.scss';

import butt1 from '../icons/butt11.svg';
import butt1m from '../icons/butt11m.svg';
import butt2 from '../icons/butt22.svg';
import butt2m from '../icons/butt22m.svg';
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

const getButtonTextColor = (bgColor) => {
  return bgColor === '#FFFFFF' ? '#1D2E43' : '#FFFFFF';
};

function JournalCard({ journal, index }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.ARTICLE);
  const authors = journal?.authors || [];
  const authorsToDisplay = authors.slice(0, 6); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1100);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallScreen(window.innerWidth <= 1100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [articleColor, annotationColor, contentColor] = TAB_COLOR_SETS[index % TAB_COLOR_SETS.length];

  const currentCardColor =
    activeTab === TABS.ARTICLE ? articleColor : activeTab === TABS.ANNOTATION ? annotationColor : contentColor;
  const scrollThumbColor = currentCardColor === '#FFFFFF' ? '#75bbfd' : '#FFFFFF';
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
  
  const handleCardClick = () => {
    navigate(`/journal/${journal.id}`, { state: { journal } });
  };


  return (
    <div className={styles.journalCard} onClick={handleCardClick}>
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
                  loading="lazy"
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
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(TABS.ARTICLE);
            }}
            style={{
              WebkitMask: `url(${isMobile ? butt1m : butt1}) no-repeat center / contain`,
              mask: `url(${isMobile ? butt1m : butt1}) no-repeat center / contain`,
              backgroundColor: articleColor,
              color: getButtonTextColor(articleColor),
            }}>
            <span className={styles.tabTextArticle}>Статья</span>
          </button>

          <button
            className={`${styles.journalCard__tabBtn} ${styles.tabBtn2} ${
              activeTab === TABS.ANNOTATION ? styles.active : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(TABS.ANNOTATION);
            }}
            style={{
              WebkitMask: `url(${isMobile ? butt2m : butt2}) no-repeat center / contain`,
              mask: `url(${isMobile ? butt2m : butt2}) no-repeat center / contain`,
              backgroundColor: annotationColor,
              color: getButtonTextColor(annotationColor),
            }}>
            <span className={styles.tabText}>Аннотация</span>
          </button>

          {!isMobile && (
            <button
              className={`${styles.journalCard__tabBtn} ${styles.tabBtn3} ${
                activeTab === TABS.CONTENT ? styles.active : ''
              }`}              
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(TABS.CONTENT);
              }}
              style={{
                WebkitMask: `url(${butt3}) no-repeat center / contain`,
                mask: `url(${butt3}) no-repeat center / contain`,
                backgroundColor: contentColor,
                color: getButtonTextColor(contentColor),
              }}>
              <span className={styles.tabText}>Содержание</span>
            </button>
          )}
        </div>

        <div
          className={styles.journalCard__content}
          style={{
            backgroundColor: currentCardColor,
            color: currentCardColor === '#FFFFFF' ? '#1d2e43' : '#FFFFFF',
            '--scroll-thumb-color': scrollThumbColor,
            '--current-bg-color': currentCardColor,
          }}>
          {activeTab === TABS.ARTICLE && (
            <>
              <div className={styles.journalCard__title}>{journal.title}</div>
              {isSmallScreen && journal.authors && journal.authors.length > 0 && (
                <div className={styles.authorsNames}>
                  <strong>{journal.authors.length > 1 ? 'Авторы: ' : 'Автор: '}</strong>
                  {journal.authors.map((author) => author.name).join(' • ')}
                </div>
              )}
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
            <AnnotationContent
              markdown={journal.markdown_content && journal.markdown_content !== 'null' ? journal.markdown_content : ''}
            />
          )}

          {activeTab === TABS.CONTENT && (
            <ContentSection
              markdown={journal.markdown_content && journal.markdown_content !== 'null' ? journal.markdown_content : ''}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalCard;
