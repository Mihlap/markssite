import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './JournalCard.module.scss';

function parseChapters(markdown) {
  // <!-- chapter:start=Название -->
  //     (любой текст)
  // <!-- chapter:end=Название -->
  const pattern = /<!--\s*chapter:start=(.*?)\s*-->([\s\S]*?)<!--\s*chapter:end=(.*?)\s*-->/g;
  const chapters = [];
  let match;
  while ((match = pattern.exec(markdown)) !== null) {
    const titleStart = match[1].trim();
    const content = match[2].trim();
    const titleEnd = match[3].trim();
    const finalTitle = titleStart === titleEnd ? titleStart : `${titleStart} / ${titleEnd}`;
    chapters.push({
      title: finalTitle,
      content,
      index: match.index,
    });
  }
  return chapters;
}

function ContentWithChapters({ markdown }) {
  const [activeChapter, setActiveChapter] = useState(null);
  if (!markdown) return null;
  const chapters = parseChapters(markdown);
  if (chapters.length === 0) return null;
  chapters.sort((a, b) => a.index - b.index);
  const chaptersWithSlug = chapters.map((ch) => {
    const slug = ch.title
      .toLowerCase()
      .replace(/[^\wа-яё\s-]/gi, '')
      .replace(/\s+/g, '-');
    return { ...ch, slug };
  });
  const handleChapterClick = (slug, e) => {
    e.preventDefault();
    setActiveChapter(slug);
    setTimeout(() => {
      setActiveChapter(null);
    }, 300);
  };

  return (
    <div className={styles.contentContainer}>
      {/* СОДЕРЖАНИЕ (Список глав) */}
      <div className={styles.tableOfContents}>
        <div className={styles.listWrapper}>
          <ul>
            {chaptersWithSlug.map((chapter, i) => (
              <li key={i} className={activeChapter === chapter.slug ? styles.activeChapter : ''}>
                <Link to={`${chapter.slug}`} onClick={(e) => handleChapterClick(chapter.slug, e)}>
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* САМИ ГЛАВЫ */}
      <div className={styles.contentMarkdown}>
        {chaptersWithSlug.map((chapter, idx) => (
          <div key={idx} id={chapter.slug} style={{ marginBottom: '2rem' }}>
            <h3>{chapter.title}</h3>
            <ReactMarkdown>{chapter.content}</ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentWithChapters;
