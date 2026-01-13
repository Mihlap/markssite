// useHashScroll.js
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useLocation } from 'react-router-dom';
gsap.registerPlugin(ScrollToPlugin);

export function useHashScroll({ aliasMap = {}, offsetY = 0, offsetYById = {}, duration = 0.6 } = {}) {
  const { hash } = useLocation();

  useEffect(() => {
    const raw = (hash || '').slice(1);
    if (!raw) return;

    const targetId = aliasMap[raw] ?? raw;
    const selector = `#${targetId}`;
    const targetEl = document.querySelector(selector);
    if (!targetEl) return;

    const effectiveOffsetY = offsetYById?.[targetId] ?? offsetY;
    const scrollOnce = (tweenDuration) => {
      gsap.to(window, {
        duration: tweenDuration,
        ease: 'power2.out',
        scrollTo: { y: selector, offsetY: effectiveOffsetY, autoKill: false },
      });
    };

    const raf = requestAnimationFrame(() => scrollOnce(duration));

    // Контент сверху (видео/картинки/слайдер) может подгрузиться и сдвинуть верстку:
    // делаем несколько быстрых "досскроллов" для стабильного фокуса.
    const t1 = setTimeout(() => scrollOnce(0.01), 120);
    const t2 = setTimeout(() => scrollOnce(0.01), 350);
    const t3 = setTimeout(() => scrollOnce(0.01), 700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      gsap.killTweensOf(window);
    };
  }, [hash, aliasMap, offsetY, offsetYById, duration]);
}
