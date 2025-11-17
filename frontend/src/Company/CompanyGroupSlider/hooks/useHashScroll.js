// useHashScroll.js
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useLocation } from 'react-router-dom';
gsap.registerPlugin(ScrollToPlugin);

export function useHashScroll({ aliasMap = {}, offsetY = 0, duration = 0.6 } = {}) {
  const { hash } = useLocation();

  useEffect(() => {
    const raw = (hash || '').slice(1);
    if (!raw) return;

    const targetId = aliasMap[raw] ?? raw;
    const selector = `#${targetId}`;
    if (!document.querySelector(selector)) return;

    const raf = requestAnimationFrame(() => {
      gsap.to(window, { duration, ease: 'power2.out', scrollTo: { y: selector, offsetY } });
    });

    return () => {
      cancelAnimationFrame(raf);
      gsap.killTweensOf(window);
    };
  }, [hash, aliasMap, offsetY, duration]);
}
