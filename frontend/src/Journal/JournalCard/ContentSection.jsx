// src/Journal/JournalCard/ContentSection.jsx

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './JournalCard.module.scss';

// Функция парсинга глав из Markdown
function parseChapters(markdown = '') {
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

export default function ContentSection({ markdown, journal }) {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState(null);

  // Парсим и сортируем главы
  const rawChapters = useMemo(() => parseChapters(markdown), [markdown]);
  const sortedChapters = useMemo(() => [...rawChapters].sort((a, b) => a.index - b.index), [rawChapters]);
  const chaptersWithSlug = useMemo(
    () =>
      sortedChapters.map((ch, idx) => {
        const base = ch.title
          .toLowerCase()
          .replace(/[^\wа-яё\s-]/gi, '')
          .replace(/\s+/g, '-');
        return { ...ch, slug: `${base}-${idx}` };
      }),
    [sortedChapters]
  );

  // При клике — навигируем в полный просмотр и передаём slug
  const handleChapterClick = useCallback(
    (slug, e) => {
      e.stopPropagation();
      setActiveChapter(slug);
      navigate(`/journal/${journal.id}`, {
        state: { journal, targetChapterSlug: slug },
      });
    },
    [journal, navigate]
  );

  if (!markdown || chaptersWithSlug.length === 0) {
    return null;
  }

  return (
    <div className={styles.contentContainer}>
      {/* Боковое оглавление */}
      <aside className={styles.tableOfContents}>
        <h4 className={styles.tocTitle}>Содержание</h4>
        <ul className={styles.listWrapper}>
          {chaptersWithSlug.map((chapter) => (
            <li key={chapter.slug} className={activeChapter === chapter.slug ? styles.activeChapter : ''}>
              <button type="button" className={styles.tocLink} onClick={(e) => handleChapterClick(chapter.slug, e)}>
                {chapter.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Превью-содержимое */}
      <div className={styles.contentMarkdown}>
        {chaptersWithSlug.map((chapter) => (
          <section key={chapter.slug} id={chapter.slug} style={{ marginBottom: '2rem' }}>
            <h3>{chapter.title}</h3>
            <ReactMarkdown>{chapter.content}</ReactMarkdown>
          </section>
        ))}
      </div>
    </div>
  );
}
