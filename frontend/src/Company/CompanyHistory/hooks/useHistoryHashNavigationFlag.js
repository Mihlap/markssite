import { useEffect, useRef } from 'react';

export function useHistoryHashNavigationFlag(hashes = ['#history', '#section1']) {
    const hashNavigationRef = useRef(false);
    const hashesKey = Array.isArray(hashes) ? hashes.join('|') : '';

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const watchedHashes = Array.isArray(hashes) ? [...hashes] : [];

        const isWatched = (hash) => watchedHashes.includes(hash);

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
    }, [hashesKey]);

    return hashNavigationRef;
}

