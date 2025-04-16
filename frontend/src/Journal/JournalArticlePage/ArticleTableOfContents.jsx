import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './ArticleTableOfContents.module.scss';

export function parseChapters(markdown) {
  const pattern = /<!--\s*chapter:start=(.*?)\s*-->([\s\S]*?)<!--\s*chapter:end=(.*?)\s*-->/g;
  const chapters = [];
  let match;
  while ((match = pattern.exec(markdown)) !== null) {
    const titleStart = match[1].trim();
    const content = match[2].trim();
    const titleEnd = match[3].trim();
    const finalTitle = titleStart === titleEnd ? titleStart : `${titleStart} / ${titleEnd}`;
    chapters.push({ title: finalTitle, content, index: match.index });
  }
  return chapters;
}

function ArticleTableOfContents({ markdown }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const { pathname } = useLocation();
  const chapters = parseChapters(markdown);

  const chaptersWithSlug = chapters.map((ch) => {
    const slug = ch.title
      .toLowerCase()
      .replace(/[^\wа-яё\s-]/gi, '')
      .replace(/\s+/g, '-');
    return { ...ch, slug };
  });

  const handleClick = (slug, e) => {
    e.preventDefault();
    setActiveChapter(slug);
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    if (window.history.pushState) {
      window.history.pushState(null, '', `${pathname}#${slug}`);
    }
  };

  return (
    <div className={styles.tocWrapper}>
      <p className={styles.tocTitle}>Содержание</p>
      <ul className={styles.tocList}>
        {chaptersWithSlug.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              to={`${pathname}#${chapter.slug}`}
              onClick={(e) => handleClick(chapter.slug, e)}
              className={activeChapter === chapter.slug ? styles.active : ''}>
              {chapter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticleTableOfContents;
