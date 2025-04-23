import React, { useEffect, useState } from 'react';
import styles from './ArticleTableOfContents.module.scss';

export function parseChapters(markdown = '') {
  if (typeof markdown !== 'string' || markdown.trim() === '') {
    return [];
  }
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

function ArticleTableOfContents({ markdown, activeSlug }) {
  const [activeChapter, setActiveChapter] = useState(activeSlug || null);

  useEffect(() => {
    if (activeSlug) {
      setActiveChapter(activeSlug);
    }
  }, [activeSlug]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveChapter(hash);
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const raw = parseChapters(markdown);
  if (!raw.length) return null;

  const skipTitles = ['аннотация', 'библиографический список'];
  
   const chaptersWithSlug = raw
     .slice()
     .sort((a, b) => a.index - b.index)
     .map((ch, idx) => {    
       const cleaned = ch.title
         .replace(/^[#*` \s]+/, '')
         .replace(/[*_~`]+/g, '')
         .trim();

       const base = cleaned
         .toLowerCase()
         .replace(/[^\wа-яё\s-]/gi, '')
         .replace(/\s+/g, '-');

       const slug = `${base}-${idx}`;
       const isUnnumbered = skipTitles.includes(cleaned.toLowerCase());

       return { ...ch, title: cleaned, slug, isUnnumbered };
     });

  const onClick = (slug, e) => {
    e.preventDefault();
    setActiveChapter(slug);
    const el = document.getElementById(slug);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', marginTop: '3rem' });
    window.history.pushState(null, '', `#${slug}`);
  };

  return (
    <nav className={styles.tocWrapper}>
      <p className={styles.tocTitle}>Содержание</p>
      <ul className={styles.tocList}>
        {chaptersWithSlug.map((chap) => (
          <li
            key={chap.slug}
            className={chap.isUnnumbered ? styles.unnumbered : ''}
            >
            <a
              href={`#${chap.slug}`}
              className={activeChapter === chap.slug ? styles.active : ''}
              onClick={(e) => onClick(chap.slug, e)}>
              {chap.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ArticleTableOfContents;
