import { useLayoutEffect } from 'react';

export function useHistoryLayoutVars(sectionRef) {
    useLayoutEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const apply = () => {
            const sbw = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
            el.style.setProperty('--sbw', `${sbw}px`);

            const padRight = Math.round(window.innerWidth * 0.9);
            el.style.setProperty('--history-pad-right', `${padRight}px`);
            el.style.setProperty('--history-pad-right-num', `${padRight}`);
        };

        apply();
        window.addEventListener('resize', apply);
        return () => window.removeEventListener('resize', apply);
    }, [sectionRef]);
}

