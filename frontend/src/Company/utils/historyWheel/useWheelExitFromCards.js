import { useEffect } from 'react';
import { isHistoryActive, isEventInsideModal, markRecentlyExited, clearFocusPhase } from './wheelShared';

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
            if (isEventInsideModal(e)) return;
            const currentOffset = horizontalOffsetRef?.current ?? 0;
            if (currentOffset > 0.5) {
                return;
            }

            if (!isHistoryActive(sectionRef, e)) return;
            if (e.deltaY >= 0) return;

            const cardsEl = historyListRef.current;
            if (!cardsEl) return;

            if (!cardsFocused || cardsFocusInProgressRef.current) return;

            const hasVerticalOverflow = cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (hasVerticalOverflow && cardsEl.scrollTop > 1) return;

            e.preventDefault();
            e.stopPropagation();

            markRecentlyExited(recentlyExitedCardsRef, 'up');
            clearFocusPhase(sectionRef);
            exitCardsFocus(cardsEl);
        };

        window.addEventListener('wheel', handleWheelUp, { passive: false, capture: false });
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
