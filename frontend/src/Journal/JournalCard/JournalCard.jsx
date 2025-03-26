// src/components/JournalCard/JournalCard.jsx
import React, { useState } from 'react';
import styles from './JournalCard.module.scss'; // Если используете CSS-модули

const TABS = {
  ARTICLE: 'Статья',
  ANNOTATION: 'Аннотация',
  CONTENT: 'Содержание',
};

function JournalCard({ journal }) {
  const [activeTab, setActiveTab] = useState(TABS.ARTICLE);

  // Список авторов
  const authors = journal?.authors || [];
  // Ограничиваемся 6 авторами
  const authorsToDisplay = authors.slice(0, 6);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.journalCard}>
      {/* Левая часть: показываем только на >= 1025px (управляем через CSS) */}
      <div className={styles.journalCard__left}>
        <div className={styles.journalCard__authorsGrid}>
          {authorsToDisplay.map((author, index) => {
            // Если у автора нет фото, вы можете подставить плейсхолдер (например, котика)
            // const imageUrl = author.image || catPlaceholder;
            const imageUrl = author.image || '';
            return (
              <img
                key={index}
                src={imageUrl}
                alt={`Автор ${author.name || ''}`}
                className={styles.journalCard__authorImg}
              />
            );
          })}
        </div>
      </div>

      {/* Правая часть: видна на всех экранах */}
      <div className={styles.journalCard__right}>
        <div className={styles.journalCard__tabs}>
          <button
            className={`${styles.journalCard__tabBtn} ${activeTab === TABS.ARTICLE ? styles.active : ''}`}
            onClick={() => handleTabClick(TABS.ARTICLE)}>
            Статья
          </button>
          <button
            className={`${styles.journalCard__tabBtn} ${activeTab === TABS.ANNOTATION ? styles.active : ''}`}
            onClick={() => handleTabClick(TABS.ANNOTATION)}>
            Аннотация
          </button>
          <button
            className={`${styles.journalCard__tabBtn} ${activeTab === TABS.CONTENT ? styles.active : ''}`}
            onClick={() => handleTabClick(TABS.CONTENT)}>
            Содержание
          </button>
        </div>

        <div className={styles.journalCard__content}>
          {/* Вкладка «Статья» */}
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

          {/* Вкладка «Аннотация» */}
          {activeTab === TABS.ANNOTATION && (
            <div className={styles.journalCard__annotation}>{journal.annotation || 'Текст аннотации...'}</div>
          )}

          {/* Вкладка «Содержание» */}
          {activeTab === TABS.CONTENT && (
            <div className={styles.journalCard__contentSection}>{journal.content || 'Текст содержания...'}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalCard;
