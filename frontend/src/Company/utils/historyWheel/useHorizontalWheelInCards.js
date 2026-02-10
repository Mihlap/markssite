import { useEffect } from 'react';
import gsap from 'gsap';
import { isHistoryActive, stopWheelHard, markRecentlyExited, clearFocusPhase } from './wheelShared';

export function useHorizontalWheelInCards({
    sectionRef,
    cardsFocused,
    timelineWrapperRef,
    historyListRef,
    cardsFocusInProgressRef,
    horizontalOffsetRef,
    recentlyExitedCardsRef,
    exitCardsFocus,
    hideYearsScale,
    showYearsScale,
}) {
    useEffect(() => {
        const container = timelineWrapperRef.current;
        const cardsEl = historyListRef.current;
        
        if (!container || !cardsEl) return;

        const MARGIN = 50;
        const SPEED = 2.0;
        const MAX_STEP = 320;
        const EASE = 'power2.out';
        const DUR = 0.22;
        const vLockRef = { current: false };
        const vLockYRef = { current: 0 };
        const applyingScrollRef = { current: false };
      
        let yearsHiddenBecauseEnd = false;

        const getOffset = () => horizontalOffsetRef.current || 0;
        const setOffset = (v) => (horizontalOffsetRef.current = v);

        const enableVLock = () => {
            vLockRef.current = true;
            vLockYRef.current = window.pageYOffset;
        };

        const disableVLock = () => {
            vLockRef.current = false;
        };

        const onScroll = () => {
            if (!vLockRef.current) return;
            if (applyingScrollRef.current) return;
            if (gsap.isTweening(window)) return;
            if (cardsFocusInProgressRef.current) return;
        };

        const getLastCardLocal = () => {
            const groups = container.querySelectorAll('[data-last-cards="true"]');
            if (!groups.length) return null;

            let rightmost = null;
            let maxRight = -Infinity;

            groups.forEach((group) => {
                const cards = group.querySelectorAll('[class*="history_card_wrapper"]');
                cards.forEach((card) => {
                    const r = card.getBoundingClientRect();
                    if (r.right > maxRight) {
                        maxRight = r.right;
                        rightmost = card;
                    }
                });

                if (!cards.length) {
                    const r = group.getBoundingClientRect();
                    if (r.right > maxRight) {
                        maxRight = r.right;
                        rightmost = group;
                    }
                }
            });

            return rightmost;
        };

        const getMaxOffset = () => {
            const last = getLastCardLocal();
            if (!last) return 0;

            const r = last.getBoundingClientRect();
            const cardRightAbs = r.right + getOffset();
            return Math.max(0, cardRightAbs - window.innerWidth + MARGIN);
        };

        const isAtEnd = () => getOffset() >= getMaxOffset() - 0.5;
        const isAtStart = () => getOffset() <= 0.5;

        const applyOffset = (next, immediate = false) => {
            const max = getMaxOffset();
            const clamped = Math.max(0, Math.min(next, max));
            setOffset(clamped);

            gsap.killTweensOf(container);

            if (immediate) {
                gsap.set(container, { x: -clamped, force3D: true });
                return;
            }

            gsap.to(container, {
                x: -clamped,
                duration: DUR,
                ease: EASE,
                overwrite: 'auto',
                force3D: true,
            });
        };

        const canExitNow = () => {
            const hasVerticalOverflow = cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (hasVerticalOverflow && cardsEl.scrollTop > 1) return false;
            return true;
        };

        const doExitUp = (e) => {
            stopWheelHard(e);
            markRecentlyExited(recentlyExitedCardsRef);
            clearFocusPhase(sectionRef);
            exitCardsFocus(cardsEl);
        };

        const onWheelCapture = (e) => {
            if (!cardsFocused) return;
            if (!isHistoryActive(sectionRef, e)) return;

            if (cardsFocusInProgressRef.current) {
                enableVLock();
                stopWheelHard(e);
                return;
            }

            const dy = e.deltaY;
            const dx = e.deltaX || 0;

            const mostlyHorizontal = Math.abs(dx) > Math.abs(dy);
            const raw = mostlyHorizontal ? dx : dy;
            if (Math.abs(raw) < 1) return;

            const down = raw > 0;
            const up = raw < 0;

            const alignCardsTopIfNeeded = () => {
                const rect = cardsEl.getBoundingClientRect();
                const offset = rect.top;
                if (Math.abs(offset) <= 1) return false;

                enableVLock();
                stopWheelHard(e);

                applyingScrollRef.current = true;
                gsap.to(window, {
                    duration: 0.22,
                    ease: EASE,
                    overwrite: 'auto',
                    scrollTo: { y: window.pageYOffset + offset, autoKill: false },
                    onUpdate: () => {
                        vLockYRef.current = window.pageYOffset;
                    },
                    onComplete: () => {
                        applyingScrollRef.current = false;
                        vLockYRef.current = window.pageYOffset;
                    },
                });

                return true;
            };

            if (down) {
                if (isAtEnd()) {                 
                    if (!yearsHiddenBecauseEnd) {
                        yearsHiddenBecauseEnd = true;
                        hideYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                    }
                    disableVLock();
                    return;
                }
             
                if (yearsHiddenBecauseEnd) {
                    yearsHiddenBecauseEnd = false;
                    showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                }

                enableVLock();
                stopWheelHard(e);

                const step = Math.min(Math.abs(raw) * SPEED, MAX_STEP);
                applyOffset(getOffset() + step);
                return;
            }

            if (up) {
                if (alignCardsTopIfNeeded()) return;

                if (yearsHiddenBecauseEnd) {
                    yearsHiddenBecauseEnd = false;
                    showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                }

                if (isAtStart()) {
                    enableVLock();
                    if (!canExitNow()) {
                        stopWheelHard(e);
                        return;
                    }
                    doExitUp(e);
                    return;
                }

                enableVLock();
                stopWheelHard(e);

                const step = Math.min(Math.abs(raw) * SPEED, MAX_STEP);
                applyOffset(getOffset() - step);
            }
        };

        if (cardsFocused) {
            applyOffset(getOffset(), true);
            enableVLock();
        } else {
            disableVLock();
            gsap.killTweensOf(container);
            gsap.set(container, { clearProps: 'transform' });
            setOffset(0);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheelCapture, { passive: false, capture: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('wheel', onWheelCapture, { capture: true });
            disableVLock();
            gsap.killTweensOf(container);
        };
    }, [
        cardsFocused,
        sectionRef,
        timelineWrapperRef,
        historyListRef,
        cardsFocusInProgressRef,
        horizontalOffsetRef,
        recentlyExitedCardsRef,
        exitCardsFocus,
        hideYearsScale,
        showYearsScale,
    ]);
}
