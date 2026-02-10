import { useEffect } from 'react';
import { isHistoryActive, markRecentlyExited, clearFocusPhase } from './wheelShared';

export function useWheelExitFromCards({
    sectionRef,
    cardsFocused,
    historyListRef,
    cardsFocusInProgressRef,
    horizontalOffsetRef,
    recentlyExitedCardsRef,
    exitCardsFocus,
}) {
    useEffect(() => {
        const handleWheelUp = (e) => {
            if (!isHistoryActive(sectionRef, e)) return;
            if (e.deltaY >= 0) return;

            const cardsEl = historyListRef.current;
            if (!cardsEl) return;

            if (!cardsFocused || cardsFocusInProgressRef.current) return;

            const hasVerticalOverflow = cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (hasVerticalOverflow && cardsEl.scrollTop > 1) return;

            if ((horizontalOffsetRef.current || 0) > 1) return;

            e.preventDefault();
            e.stopPropagation();

            markRecentlyExited(recentlyExitedCardsRef);
            clearFocusPhase(sectionRef);
            exitCardsFocus(cardsEl);
        };

        window.addEventListener('wheel', handleWheelUp, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelUp);
    }, [
        sectionRef,
        cardsFocused,
        exitCardsFocus,
        historyListRef,
        cardsFocusInProgressRef,
        horizontalOffsetRef,
        recentlyExitedCardsRef,
    ]);
}
