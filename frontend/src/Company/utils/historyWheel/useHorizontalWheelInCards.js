import { useEffect } from 'react';
import gsap from 'gsap';
import { isHistoryActive, stopWheelHard, markRecentlyExited, clearFocusPhase } from './wheelShared';

function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

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

        const EASE = 'power2.out';
        const DUR = 0.55;

        const TARGET_DOT_X = 90;

        const START_FORCE_PX = 24;
        const START_SNAP_PX = 120;

        const END_EPS_RATIO = 0.8;
        const END_EPS_EXTRA_PX = 160;
        const END_EPS_MIN = 120;
        const END_EPS_MAX = 700;

        const WHEEL_COOLDOWN_MS = 260;

        const vLockRef = { current: false };
        const vLockYRef = { current: 0 };
        const applyingScrollRef = { current: false };

        let yearsHiddenBecauseEnd = false;

        let endEps = 260;
        let lastWheelAt = 0;

        const getOffset = () =>
            horizontalOffsetRef?.current != null ? Number(horizontalOffsetRef.current || 0) : 0;

        const setOffset = (v) => {
            if (horizontalOffsetRef) horizontalOffsetRef.current = v;
        };

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

        const getMarkers = () => {
            try {
                return Array.from(container.querySelectorAll('[data-year-marker="true"][data-year]'));
            } catch {
                return [];
            }
        };

        const getMaxOffset = () => {
            const vw = window.innerWidth || 1;
            return Math.max(0, container.scrollWidth - vw);
        };

        const clampOffset = (v) => clamp(v, 0, getMaxOffset());

        const isAtEnd = () => getOffset() >= getMaxOffset() - endEps;

        const getDotCenter = (markerEl) => {
            if (!markerEl) return null;
            const dot = markerEl.querySelector('[data-year-dot="true"]');
            if (dot) {
                const cx = markerEl.offsetLeft + dot.offsetLeft + dot.offsetWidth / 2;
                if (Number.isFinite(cx)) return cx;
            }
            const fallback = markerEl.offsetLeft + markerEl.offsetWidth / 2;
            return Number.isFinite(fallback) ? fallback : null;
        };

        const updateEndEps = () => {
            const markers = getMarkers();
            if (markers.length >= 2) {
                const c0 = getDotCenter(markers[0]);
                const c1 = getDotCenter(markers[1]);
                if (c0 != null && c1 != null) {
                    const step = Math.max(1, c1 - c0);
                    endEps = clamp(step * END_EPS_RATIO + END_EPS_EXTRA_PX, END_EPS_MIN, END_EPS_MAX);
                    return;
                }
            }
            endEps = 260;
        };

        const applyOffset = (next, immediate = false, onDone) => {
            const clamped = clampOffset(next);
            setOffset(clamped);

            gsap.killTweensOf(container);

            if (immediate) {
                gsap.set(container, { x: -clamped, force3D: true });
                onDone?.(clamped);
                return;
            }

            gsap.to(container, {
                x: -clamped,
                duration: DUR,
                ease: EASE,
                overwrite: 'auto',
                force3D: true,
                onUpdate: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    const off = Math.max(0, -x);
                    setOffset(off);
                },
                onComplete: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    const off = Math.max(0, -x);
                    setOffset(off);
                    onDone?.(off);
                },
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

        const alignCardsTopIfNeeded = (e) => {
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

        const setActiveAttr = (idx) => {
            const markers = getMarkers();
            for (let i = 0; i < markers.length; i += 1) {
                if (i === idx) markers[i].setAttribute('data-active', 'true');
                else markers[i].removeAttribute('data-active');
            }
        };

        const snapToStart = (immediate = false) => {
            setActiveAttr(0);
            applyOffset(0, immediate, () => setActiveAttr(0));
        };

        const getClosestIndexToLeftEdge = () => {
            const markers = getMarkers();
            if (!markers.length) return -1;

            const off = getOffset();
            if (off <= START_FORCE_PX) return 0;

            const edgeX = off + TARGET_DOT_X;

            let bestIdx = -1;
            let bestAbs = Infinity;

            for (let i = 0; i < markers.length; i += 1) {
                const c = getDotCenter(markers[i]);
                if (c == null) continue;
                const dAbs = Math.abs(c - edgeX);
                if (dAbs < bestAbs) {
                    bestAbs = dAbs;
                    bestIdx = i;
                }
            }

            if (bestIdx < 0) bestIdx = 0;
            return bestIdx;
        };

        const shouldSnapToTarget = (idx) => {
            const markers = getMarkers();
            if (!markers.length) return false;

            const off = getOffset();
            if (idx === 0 && off <= START_SNAP_PX) return false;

            const i = clamp(idx, 0, markers.length - 1);
            const c = getDotCenter(markers[i]);
            if (c == null) return false;

            const currentX = c - off;
            const delta = currentX - TARGET_DOT_X;

            return Math.abs(delta) > 14;
        };

        const getActiveIndex = () => {
            const markers = getMarkers();
            if (!markers.length) return -1;

            const off = getOffset();
            if (off <= START_FORCE_PX) return 0;

            const activeEl = container.querySelector('[data-year-marker="true"][data-active="true"]');
            if (activeEl) {
                const y = activeEl.getAttribute('data-year');
                const idx = markers.findIndex((m) => m.getAttribute('data-year') === y);
                if (idx >= 0) return idx;
            }

            return getClosestIndexToLeftEdge();
        };

        const scrollToMarkerIndex = (idx, opts = {}) => {
            const { immediate = false } = opts;

            updateEndEps();

            const markers = getMarkers();
            if (!markers.length) return;

            const i = clamp(idx, 0, markers.length - 1);

            if (i === 0) {
                snapToStart(immediate);
                if (yearsHiddenBecauseEnd) {
                    yearsHiddenBecauseEnd = false;
                    showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                }
                return;
            }

            const el = markers[i];
            const dotCenter = getDotCenter(el);
            if (dotCenter == null) return;

            let targetOffset = dotCenter - TARGET_DOT_X;
            if (!Number.isFinite(targetOffset)) targetOffset = 0;

            targetOffset = clampOffset(targetOffset);

            setActiveAttr(i);
            applyOffset(targetOffset, immediate);

            if (i >= markers.length - 1 || isAtEnd()) {
                if (!yearsHiddenBecauseEnd) {
                    yearsHiddenBecauseEnd = true;
                    hideYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                }
            } else {
                if (yearsHiddenBecauseEnd) {
                    yearsHiddenBecauseEnd = false;
                    showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                }
            }
        };

        const allowVerticalScrollDownAtEnd = () => {
            if (!yearsHiddenBecauseEnd) {
                yearsHiddenBecauseEnd = true;
                hideYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
            }
            disableVLock();
        };

        const stepByWheel = (dir, e) => {
            const now = Date.now();
            if (now - lastWheelAt < WHEEL_COOLDOWN_MS) {
                stopWheelHard(e);
                return;
            }
            lastWheelAt = now;

            const markers = getMarkers();
            if (!markers.length) return;

            const cur = getActiveIndex();
            if (cur < 0) return;

            const next = dir > 0 ? cur + 1 : cur - 1;

            if (dir > 0 && (cur >= markers.length - 1 || isAtEnd())) {
                allowVerticalScrollDownAtEnd();
                return;
            }

            if (dir < 0) {
                if (next <= 0) {
                    enableVLock();
                    stopWheelHard(e);

                    if (getOffset() > 0.5) {
                        snapToStart(false);
                        return;
                    }

                    if (!canExitNow()) return;
                    doExitUp(e);
                    return;
                }

                if (alignCardsTopIfNeeded(e)) return;
            }

            enableVLock();
            stopWheelHard(e);

            scrollToMarkerIndex(next, { immediate: false });
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

            if (raw > 0) {
                if (isAtEnd()) {
                    allowVerticalScrollDownAtEnd();
                    return;
                }
                stepByWheel(+1, e);
                return;
            }

            if (raw < 0) {
                stepByWheel(-1, e);
            }
        };

        const init = () => {
            updateEndEps();

            if (cardsFocused) {
                const off = clampOffset(getOffset());
                setOffset(off);
                gsap.set(container, { x: -off, force3D: true });
                enableVLock();

                const idx = getClosestIndexToLeftEdge();
                if (idx >= 0) setActiveAttr(idx);

                const isInitialEnter = off <= 1;

                if (!isInitialEnter && shouldSnapToTarget(idx)) {
                    scrollToMarkerIndex(idx, { immediate: true });
                }

                if (off <= START_FORCE_PX) {
                    setActiveAttr(0);
                }

                if (isAtEnd()) {
                    yearsHiddenBecauseEnd = true;
                    hideYearsScale?.(true);
                } else {
                    yearsHiddenBecauseEnd = false;
                }
            } else {
                yearsHiddenBecauseEnd = false;
                disableVLock();
                gsap.killTweensOf(container);
                gsap.set(container, { clearProps: 'transform' });
                setOffset(0);
            }
        };

        init();

        const onResize = () => {
            updateEndEps();
            if (!cardsFocused) return;

            if (getOffset() <= START_SNAP_PX) {
                snapToStart(true);
                return;
            }

            const idx = getActiveIndex();
            if (idx >= 0) scrollToMarkerIndex(idx, { immediate: true });
        };

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheelCapture, { passive: false, capture: true });

        return () => {
            window.removeEventListener('resize', onResize);
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
