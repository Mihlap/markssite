import { useEffect, useRef } from 'react';

export function useHistoryHashNavigationFlag(hashes = ['#history', '#section1']) {
    const hashNavigationRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const isWatched = (hash) => hashes.includes(hash);

        const mark = () => {
            hashNavigationRef.current = true;
            setTimeout(() => {
                hashNavigationRef.current = false;
            }, 100);
        };

        const handleHashChange = () => {
            if (isWatched(window.location.hash)) mark();
        };

        window.addEventListener('hashchange', handleHashChange);
        if (isWatched(window.location.hash)) mark();

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [hashes]);

    return hashNavigationRef;
}

