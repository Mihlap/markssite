import { useCallback, useRef } from 'react';

export function useHistoryMobileScrollLock() {
    const mobileScrollLockedRef = useRef(false);

    const lockMobileScroll = useCallback(() => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth > 767) return;
        if (mobileScrollLockedRef.current) return;
        const body = document.body;
        if (!body) return;
        mobileScrollLockedRef.current = true;
        body.dataset.historyScrollLocked = 'true';
        body.style.overflowY = 'hidden';
    }, []);

    const unlockMobileScroll = useCallback(() => {
        if (!mobileScrollLockedRef.current) return;
        mobileScrollLockedRef.current = false;
        if (typeof window === 'undefined') return;
        const body = document.body;
        if (!body) return;
        if (body.dataset.historyScrollLocked) {
            delete body.dataset.historyScrollLocked;
            body.style.overflowY = '';
        }
    }, []);

    return { lockMobileScroll, unlockMobileScroll, mobileScrollLockedRef };
}

