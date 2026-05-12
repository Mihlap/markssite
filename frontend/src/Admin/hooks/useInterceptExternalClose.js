import { useEffect } from 'react';

export default function useInterceptExternalClose(selector, onIntercept) {
  useEffect(() => {
    const el = selector ? document.querySelector(selector) : null;
    if (!el) return;

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onIntercept?.();
    };
  
    el.addEventListener('click', handler, true);
    return () => el.removeEventListener('click', handler, true);
  }, [selector, onIntercept]);
}
