import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useLocation } from 'react-router';
import styles from './ArticleTableOfContents.module.scss';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function parseChapters(markdown = '') {
  if (typeof markdown !== 'string' || !markdown.trim()) return [];
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

export default function ArticleTableOfContents({ markdown = '' }) {
  const location = useLocation();
  const [activeChapter, setActiveChapter] = useState('');
  const tocRef = useRef(null);

  useEffect(() => {
    if (location.state?.targetChapterSlug) {
      setActiveChapter(location.state.targetChapterSlug);

      const slug = location.state.targetChapterSlug;
      setTimeout(() => {
        const el = document.getElementById(slug);
        if (el) {
          const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;      
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - rem * 4,
            behavior: 'smooth',
          });
        }
      }, 0);
    }
  }, [location.state]);

  useEffect(() => {
    const toc = tocRef.current;
    const wrapper = document.getElementById('articleLayout');
    if (!toc || !wrapper) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1200px)', () => {
      const st = ScrollTrigger.create({
        trigger: toc,
        start: 'top top',
        endTrigger: wrapper,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
        onEnter: () => gsap.to(toc, { y: '2rem', duration: 0.3, ease: 'power1.out' }),
        onEnterBack: () => gsap.to(toc, { y: '2rem', duration: 0.3, ease: 'power1.out' }),
        onLeave: () => {
          if (toc.scrollHeight > toc.clientHeight) {
            toc.scrollTo({ top: toc.scrollHeight - toc.clientHeight, behavior: 'smooth' });
          }
        },
        onLeaveBack: () => {
          gsap.to(toc, { y: '0rem', duration: 0.3, ease: 'power1.out' });
          toc.scrollTo({ top: 0, behavior: 'smooth' });
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
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

      const displayTitle = cleaned.replace(/^\d+\.\s*/, '');

      return { ...ch, title: cleaned, slug, isUnnumbered, displayTitle };
    });

  const onClick = (slug, e) => {
    e.preventDefault();
    setActiveChapter(slug);  
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const el = document.getElementById(slug);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - rem * 4,
        behavior: 'smooth',
      });
      window.history.replaceState(null, '', `#${slug}`);
    }
  };

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
              {chap.displayTitle}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
