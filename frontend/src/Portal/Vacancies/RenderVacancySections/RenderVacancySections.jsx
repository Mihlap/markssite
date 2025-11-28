import React from 'react';
import styles from '../VacanciesMainCard/VacanciesMainCard.module.scss';

const RenderVacancySections = ({ showOnRef, vacancy }) => {
  const formatContentWithSpans = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const listItems = doc.querySelectorAll('li');

    listItems.forEach((li) => {
      const span = document.createElement('span');
      span.innerHTML = li.innerHTML;
      li.innerHTML = '';
      li.appendChild(span);
    });

    return doc.body.innerHTML;
  };

  const formatSkills = (skills) => {
    return skills
      .split(',')
      .map((skill) => `<span class="${styles['main_vacancyWrapper__skills-item']}">${skill.trim()}</span>`)
      .join('');
  };

  if (!vacancy) return null;

  return (
    <div>
      <div className={styles.main_vacancyWrapper__wrapperTitle}>
        <h4 ref={showOnRef}>Вам предстоит:</h4>
      </div>

      <div
        className={styles.main_vacancyWrapper__textBlock}
        dangerouslySetInnerHTML={{
          __html: formatContentWithSpans(vacancy.haveToWork),
        }}
      />

      <div className={styles.main_vacancyWrapper__wrapperTitle}>
        <h4>Требования:</h4>
      </div>

      <div
        className={styles.main_vacancyWrapper__textBlock}
        dangerouslySetInnerHTML={{
          __html: formatContentWithSpans(vacancy.requirements),
        }}
      />

      <div className={styles.main_vacancyWrapper__wrapperTitle1}>
        <h4>Ключевые навыки</h4>
      </div>

      <div
        // className={styles.main_vacancyWrapper__textBlock}
        className={styles['main_vacancyWrapper__skills-list']}
        dangerouslySetInnerHTML={{
          __html: formatSkills(vacancy.skills),
        }}
      />
    </div>
  );
};

export default RenderVacancySections;
