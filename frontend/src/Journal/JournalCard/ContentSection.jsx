import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JournalCard.module.scss';

function parseChapters(markdown = '') {
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

export default function ContentSection({ markdown, journal }) {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState(null);


  const rawChapters = useMemo(() => parseChapters(markdown), [markdown]);
  const sortedChapters = useMemo(() => [...rawChapters].sort((a, b) => a.index - b.index), [rawChapters]);
 
  const chaptersWithSlug = useMemo(
    () =>
      sortedChapters.map((ch, idx) => {      
        const cleaned = ch.title
          .replace(/^[#*`_\s]+/, '')
          .replace(/[*_~`]+/g, '')
          .trim();

      const base = cleaned
          .toLowerCase()
          .replace(/[^\wа-яё\s-]/gi, '')
          .replace(/\s+/g, '-');
        const slug = `${base}-${idx}`;
       
        const displayTitle = cleaned.replace(/^\d+\.\s*/, '');

        return {
          ...ch,
          title: cleaned,
          slug, 
          displayTitle, 
        };
      }),
    [sortedChapters]  );


  const handleChapterClick = useCallback(
    (slug, e) => {
      e.stopPropagation();
      setActiveChapter(slug);
      navigate(`/journal/${journal.id}`, {
        state: { targetChapterSlug: slug },
      });
    },
    [journal, navigate]
  );

  if (!markdown || chaptersWithSlug.length === 0) {
    return null;
  }

  return (
    <div className={styles.contentContainer}>
      <aside className={styles.tableOfContents}>
        <ul className={styles.listWrapper}>
          {chaptersWithSlug.map((chapter) => (
            <li key={chapter.slug} className={activeChapter === chapter.slug ? styles.activeChapter : ''}>
              <button type="button" className={styles.tocLink} onClick={(e) => handleChapterClick(chapter.slug, e)}>
                {chapter.displayTitle}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
