import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ArticleTableOfContents.module.scss';

gsap.registerPlugin(ScrollTrigger);

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

function ArticleTableOfContents({ markdown = '', activeSlug }) {
  const [activeChapter, setActiveChapter] = useState(activeSlug || '');
  const tocRef = useRef(null);

  useEffect(() => {
    if (activeSlug) setActiveChapter(activeSlug);
  }, [activeSlug]);

 
  useEffect(() => {
    const toc = tocRef.current;
    const wrapper = document.getElementById('articleLayout');
    if (!toc || !wrapper) return;

    const mm = gsap.matchMedia();

   mm.add('(min-width: 1200px) and (max-width: 1600px)', () => {
     const st = ScrollTrigger.create({
       trigger: toc,
       start: 'top top',
       endTrigger: wrapper,
       end: 'bottom bottom',
       pin: true,
       pinSpacing: false,
      onEnter:     () => gsap.to(toc, { y: '2rem', duration: 0.3, ease: 'power1.out' }),  
      onEnterBack: () => gsap.to(toc, { y: '2rem', duration: 0.3, ease: 'power1.out' }),  
     });
     return () => st.kill();
   });

    mm.add('(min-width: 1601px)', () => {    
      const endPos = document.body.scrollHeight - window.innerHeight;
      const st = ScrollTrigger.create({
        trigger: toc,
        start: 'top top',
        end: endPos,
        pin: true,
        pinSpacing: false,
        onEnter: () => gsap.to(toc, { y: '2rem', duration: 0.3, ease: 'power1.out' }),
        onEnterBack: () => gsap.to(toc, { y: '2rem', duration: 0.3, ease: 'power1.out' }),    
      });
      return () => st.kill();
    });

    mm.add('(max-width: 1199px)', () => {
    });

     return () => {
       mm.revert();
       ScrollTrigger.getAll().forEach((t) => t.kill());
     };
  }, []);

  const onClick = (slug, e) => {
    e.preventDefault();
    setActiveChapter(slug);
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${slug}`);
    }
  };

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

  return (
    <nav ref={tocRef} className={styles.tocWrapper}>
      <p className={styles.tocTitle}>Содержание</p>
      <ul className={styles.tocList}>
        {chaptersWithSlug.map((chap) => (
          <li key={chap.slug} className={chap.isUnnumbered ? styles.unnumbered : ''}>
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
