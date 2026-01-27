import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export function useHashScroll({
  aliasMap = {},
  offsetY = 0,
  offsetYById = {},
  duration = 0.6,
  debug = false,
} = {}) {
  const location = useLocation();
  const handledRef = useRef(new Set());

  useEffect(() => {
    const rawHash = location.hash;
    if (!rawHash) return;

    const rawId = rawHash.replace('#', '');
    const mappedId = aliasMap?.[rawId] || rawId;
    const selector = `#${mappedId}`;

    const key = `${location.key || ''}|${selector}`;
    if (handledRef.current.has(key)) {
      if (debug) console.log('[useHashScroll] already handled', key);
      return;
    }

    let killed = false;
    const log = (...args) => debug && console.log('[useHashScroll]', ...args);

    const getOffset = () => {
      const specific = offsetYById?.[mappedId];
      return typeof specific === 'number' ? specific : offsetY;
    };

    const startTween = (targetY) => {
      const startY = window.pageYOffset || 0;

      gsap.killTweensOf(window);

      gsap.to({ p: 0 }, {
        p: 1,
        duration,
        ease: 'power2.out',
        overwrite: true,
        onStart: () => log('gsap start'),
        onUpdate: function () {
          const p = this.targets()[0].p;
          const y = startY + (targetY - startY) * p;
          window.scrollTo(0, y);
        },
        onComplete: () => {
          window.scrollTo(0, targetY);
          handledRef.current.add(key);
          log('gsap complete y=', targetY);
        },
      });
    };

    const tryRun = () => {
      if (killed) return;

      const el = document.querySelector(selector);
      if (!el) {
        log('target NOT found', selector);
        requestAnimationFrame(tryRun);
        return;
      }

      const offset = getOffset();
      const rect = el.getBoundingClientRect();
      const targetY = Math.max(0, window.pageYOffset + rect.top - offset);

      log('target FOUND', { selector, targetY, offset });
      startTween(targetY);
    };

    tryRun();

    return () => {
      killed = true;
      gsap.killTweensOf(window);
      log('cleanup');
    };
  }, [location.key, location.hash, aliasMap, offsetY, offsetYById, duration, debug]);
}
