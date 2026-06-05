import { useEffect } from 'react';
import gsap from 'gsap';
import { isHistoryActive, stopWheelHard, markRecentlyExited, clearFocusPhase } from './wheelShared';
import { createPeekCardsManager, clearCardSplit } from './usePeekCards';

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
    hideHistoryTag,
    showAndPlaceHistoryTag,
    isModalOpen = false,
    isDesktop,
}) {
    useEffect(() => {
        if (isDesktop === false) return;
        const container = timelineWrapperRef.current;
        const cardsEl = historyListRef.current;

        if (!container || !cardsEl) return;

        const peekCards = createPeekCardsManager(container);

        const EASE = 'power2.out';
        const DUR = 0.55;

        const DEFAULT_TARGET_DOT_X = 90;

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

        const emitActiveYear = (year, pulse = false) => {
            if (!year) return;
            window.dispatchEvent(
                new CustomEvent('history:activeYear', {
                    detail: { year: String(year), pulse: Boolean(pulse) },
                })
            );
        };

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

        const isAtEndWith = (off) => off >= getMaxOffset() - endEps;

        const showYearsScaleNow = () => {
            if (!yearsHiddenBecauseEnd) return;
            yearsHiddenBecauseEnd = false;
            showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
            showAndPlaceHistoryTag?.({ duration: 0.3, ease: 'power2.out' });
        };

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

        const getAnchorDotX = () => {
            const markers = getMarkers();
            const c0 = markers.length ? getDotCenter(markers[0]) : null;
            return c0 != null ? c0 : DEFAULT_TARGET_DOT_X;
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

        const DOT_ACTIVE_DESKTOP_PX = 30;
        const DOT_OVERSHOOT_DESKTOP_PX = 40;
        const DOT_ACTIVE_TOUCH_PX = 24;
        const DOT_OVERSHOOT_TOUCH_PX = 28;

        const travelDotRef = {
            current: {
                marker: null,
                dot: null,
                activeScale: 1,
                overScale: 1,
                enabled: false,
            },
        };

        const travelArm = (markerEl) => {
            const st = travelDotRef.current;

            st.marker = null;
            st.dot = null;
            st.enabled = false;

            if (!markerEl) return;

            const dot = markerEl.querySelector('[data-year-dot="true"]');
            if (!dot) return;

            gsap.killTweensOf(dot);
            gsap.killTweensOf(markerEl);

            const base = Number(dot.offsetWidth || 22) || 22;
            const activePx = isDesktop ? DOT_ACTIVE_DESKTOP_PX : DOT_ACTIVE_TOUCH_PX;
            const overPx = isDesktop ? DOT_OVERSHOOT_DESKTOP_PX : DOT_OVERSHOOT_TOUCH_PX;
            const activeScale = Math.max(1, activePx / base);
            const overScale = Math.max(activeScale, overPx / base);

            st.marker = markerEl;
            st.dot = dot;
            st.activeScale = activeScale;
            st.overScale = overScale;
            st.enabled = true;

            dot.style.setProperty('--dot-scale', '1');
            markerEl.style.setProperty('--dot-cutout-scale', '1');
        };

        const travelUpdate = (p) => {
            const st = travelDotRef.current;
            if (!st.enabled || !st.dot || !st.marker) return;

            const t = clamp(Number(p || 0), 0, 1);

            const peakAt = 0.55;

            const smooth = (x) => {
                return x * x * x * (x * (x * 6 - 15) + 10);
            };
            const lerp = (a, b, x) => a + (b - a) * x;

            let s;

            if (t <= peakAt) {
                const u = smooth(t / peakAt);
                s = lerp(1, st.overScale, u);
            } else {
                const u = smooth((t - peakAt) / (1 - peakAt));
                s = lerp(st.overScale, st.activeScale, u);
            }

            st.dot.style.setProperty('--dot-scale', String(s));
            st.marker.style.setProperty('--dot-cutout-scale', String(s));
        };

        const travelFinish = () => {
            const st = travelDotRef.current;
            if (st.enabled && st.dot && st.marker) {
                st.dot.style.setProperty('--dot-scale', String(st.activeScale));
                st.marker.style.setProperty('--dot-cutout-scale', String(st.activeScale));
            }
            st.marker = null;
            st.dot = null;
            st.enabled = false;
        };

        const animateDotWithOvershoot = (markerEl) => {
            if (!markerEl) return;

            const dot = markerEl.querySelector('[data-year-dot="true"]');
            if (!dot) return;

            gsap.killTweensOf(dot);
            gsap.killTweensOf(markerEl);

            const base = Number(dot.offsetWidth || 22) || 22;
            const activePx = isDesktop ? DOT_ACTIVE_DESKTOP_PX : DOT_ACTIVE_TOUCH_PX;
            const overPx = isDesktop ? DOT_OVERSHOOT_DESKTOP_PX : DOT_OVERSHOOT_TOUCH_PX;
            const activeScale = Math.max(1, activePx / base);
            const overScale = Math.max(activeScale, overPx / base);

            dot.style.setProperty('--dot-scale', '1');
            markerEl.style.setProperty('--dot-cutout-scale', '1');

            const tl = gsap.timeline({ overwrite: true });

            tl.to([dot, markerEl], {
                '--dot-scale': overScale,
                '--dot-cutout-scale': overScale,
                duration: 0.45,
                ease: 'power2.out',
            }).to([dot, markerEl], {
                '--dot-scale': activeScale,
                '--dot-cutout-scale': activeScale,
                duration: 0.4,
                ease: 'power2.out',
            });
        };

        const applyOffset = (next, immediate = false, onDone, opts = null) => {
            const clamped = clampOffset(next);
            const startOffset = getOffset();

            const dur = opts && Number.isFinite(opts.duration) ? Number(opts.duration) : DUR;
            const ease = opts && opts.ease ? String(opts.ease) : EASE;

            setOffset(clamped);

            gsap.killTweensOf(container);

            if (immediate) {
                peekCards.killPeekTween();
                gsap.set(container, { x: -clamped, force3D: true });
                peekCards.applyPeekStateForRightEdgeCards();
                peekCards.primePeekCard();
                travelFinish();
                onDone?.(clamped);
                return;
            }

            if (Math.abs(clamped - startOffset) > 8) {
                peekCards.armPeekForSnap(startOffset, clamped);
            } else {
                peekCards.killPeekTween();
            }

            const tween = gsap.to(container, {
                x: -clamped,
                duration: dur,
                ease,
                overwrite: 'auto',
                force3D: true,
                onUpdate: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    const off = Math.max(0, -x);
                    setOffset(off);

                    peekCards.applyPeekStateForRightEdgeCards();
                    peekCards.updatePeekProgress(off);

                    travelUpdate(tween.progress());
                },
                onComplete: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    const off = Math.max(0, -x);
                    setOffset(off);
                    peekCards.finishPeekSnap();
                    travelFinish();
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
            markRecentlyExited(recentlyExitedCardsRef, 'up');
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
            const markers = getMarkers();
            const y0 = markers[0]?.getAttribute('data-year') || null;
            setActiveAttr(0);
            emitActiveYear(y0, false);
            animateDotWithOvershoot(markers[0] || null);

            applyOffset(0, immediate, () => {
                setActiveAttr(0);
                emitActiveYear(y0, false);
            });
        };

        const getClosestIndexToTargetX = () => {
            const markers = getMarkers();
            if (!markers.length) return -1;

            const off = getOffset();

            if (off <= START_SNAP_PX) return 0;

            const edgeX = off + getAnchorDotX();

            let bestIdx = 0;
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

            return bestIdx;
        };

        const getActiveIndex = () => {
            const markers = getMarkers();
            if (!markers.length) return -1;

            const off = getOffset();
            if (off <= START_FORCE_PX) return 0;

            return getClosestIndexToTargetX();
        };

        const scrollToMarkerIndex = (idx, opts = {}) => {
            const { immediate = false, onDone: externalOnDone } = opts;

            updateEndEps();

            const markers = getMarkers();
            if (!markers.length) return;

            const i = clamp(idx, 0, markers.length - 1);

            const year = markers[i]?.getAttribute('data-year') || null;

            if (i === 0) {
                snapToStart(immediate);
                if (yearsHiddenBecauseEnd) {
                    yearsHiddenBecauseEnd = false;
                    showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                    showAndPlaceHistoryTag?.({ duration: 0.3, ease: 'power2.out' });
                }
                return;
            }

            const el = markers[i];
            const dotCenter = getDotCenter(el);
            if (dotCenter == null) return;

            let targetOffset = dotCenter - getAnchorDotX();
            if (!Number.isFinite(targetOffset)) targetOffset = 0;

            targetOffset = clampOffset(targetOffset);

            setActiveAttr(i);
            emitActiveYear(year, false);
            animateDotWithOvershoot(el);

            applyOffset(targetOffset, immediate, (off) => {
                emitActiveYear(year, false);

                const atEnd = i >= markers.length - 1 || isAtEndWith(off);
                if (!atEnd) {
                    if (yearsHiddenBecauseEnd) {
                        yearsHiddenBecauseEnd = false;
                        showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                        showAndPlaceHistoryTag?.({ duration: 0.3, ease: 'power2.out' });
                    }
                }

                if (typeof externalOnDone === 'function') {
                    externalOnDone(off);
                }
            });

            const after = targetOffset;
            if (!(i >= markers.length - 1 || isAtEndWith(after))) {
                if (yearsHiddenBecauseEnd) {
                    yearsHiddenBecauseEnd = false;
                    showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                    showAndPlaceHistoryTag?.({ duration: 0.3, ease: 'power2.out' });
                }
            }
        };

        const allowVerticalScrollDownAtEnd = () => {
            if (!yearsHiddenBecauseEnd) {
                yearsHiddenBecauseEnd = true;
                hideYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
            }
            hideHistoryTag?.(false, { duration: 0.3, ease: 'power1.out' });
            disableVLock();
        };

        let swipeLocked = false;

        const stepBySwipe = (dir) => {
            if (swipeLocked) return;

            const markers = getMarkers();
            if (!markers.length) return;

            const cur = getActiveIndex();
            if (cur < 0) return;

            let next = dir > 0 ? cur + 1 : cur - 1;

            if (next < 0) next = 0;
            if (next >= markers.length) next = markers.length - 1;
            if (next === cur) return;

            if (dir < 0) showYearsScaleNow();

            swipeLocked = true;

            scrollToMarkerIndex(next, {
                immediate: false,
                onDone: () => {
                    swipeLocked = false;
                },
            });
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

            if (dir > 0 && (cur >= markers.length - 1 || isAtEndWith(getOffset()))) {
                allowVerticalScrollDownAtEnd();
                return;
            }

            if (dir < 0) {
                if (next <= 0) {
                    enableVLock();
                    stopWheelHard(e);

                    const off = getOffset();

                    if (off > 0.5) {
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
            if (isModalOpen) return;
            if (!isDesktop) return;

            if (e?.target) {
                const target = e.target;
                const modalElement = target.closest?.('[class*="modal"]') ||
                    target.closest?.('[class*="Modal"]') ||
                    target.closest?.('[class*="ReactModal"]') ||
                    target.closest?.('[role="dialog"]');
                if (modalElement) return;
            }

            if (!cardsFocused) return;

            if (!isHistoryActive(sectionRef, e)) {
                const root = sectionRef?.current;
                if (!root) return;
                const r = root.getBoundingClientRect();
                if (r.bottom <= 0 || r.top >= window.innerHeight) return;
                if (e.deltaY >= 0) return;

                stopWheelHard(e);
                enableVLock();

                if (!gsap.isTweening(window) && !applyingScrollRef.current) {
                    const lineEl = container?.querySelector('[class*="timeline_line"]');
                    if (lineEl) {
                        const lineRect = lineEl.getBoundingClientRect();
                        const centerAbs = lineRect.top + window.pageYOffset + lineRect.height / 2;
                        const targetY = Math.max(0, centerAbs - window.innerHeight / 2);

                        applyingScrollRef.current = true;
                        gsap.to(window, {
                            duration: 0.4,
                            ease: 'power2.out',
                            overwrite: 'auto',
                            scrollTo: { y: targetY, autoKill: false },
                            onUpdate: () => {
                                vLockYRef.current = window.pageYOffset;
                            },
                            onComplete: () => {
                                applyingScrollRef.current = false;
                                vLockYRef.current = window.pageYOffset;
                            },
                        });
                    }
                }
                return;
            }

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
                if (isAtEndWith(getOffset())) {
                    allowVerticalScrollDownAtEnd();
                    return;
                }
                stepByWheel(+1, e);
                return;
            }

            if (raw < 0) {
                showYearsScaleNow();
                stepByWheel(-1, e);
            }
        };

        const onExternalScrollToOffset = (ev) => {
            if (!cardsFocused) return;

            const d = ev?.detail || {};
            const targetOffset = Number(d.targetOffset);
            if (!Number.isFinite(targetOffset)) return;

            updateEndEps();
            enableVLock();

            const markers = getMarkers();

            let idx = -1;
            if (d.year != null) {
                const yy = String(d.year);
                idx = markers.findIndex((m) => String(m.getAttribute('data-year')) === yy);
                if (idx >= 0) setActiveAttr(idx);
                emitActiveYear(yy, false);
                travelArm(idx >= 0 ? markers[idx] : null);
            }

            applyOffset(
                targetOffset,
                false,
                (off) => {
                    const atEnd = isAtEndWith(off);

                    if (d.year != null) emitActiveYear(String(d.year), false);

                    if (atEnd) {
                        if (!yearsHiddenBecauseEnd) {
                            yearsHiddenBecauseEnd = true;
                            hideYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                        }
                    } else {
                        if (yearsHiddenBecauseEnd) {
                            yearsHiddenBecauseEnd = false;
                            showYearsScale?.(false, { duration: 0.35, ease: 'power2.out' });
                            showAndPlaceHistoryTag?.({ duration: 0.3, ease: 'power2.out' });
                        }
                    }

                    window.dispatchEvent(
                        new CustomEvent('history:scrollToOffsetDone', {
                            detail: {
                                token: d.token || null,
                                year: d.year != null ? String(d.year) : null,
                                offset: off,
                            },
                        })
                    );
                },
                {
                    duration: Number.isFinite(d.duration) ? Number(d.duration) : 0.85,
                    ease: d.ease || 'power2.out',
                }
            );
        };

        const touchState = {
            active: false,
            startX: 0,
            startY: 0,
            dx: 0,
            dy: 0,
        };

        const onPointerDown = (e) => {
            if (isDesktop) return;
            if (e.pointerType !== 'touch') return;
            if (isModalOpen) return;

            touchState.active = true;
            touchState.startX = e.clientX;
            touchState.startY = e.clientY;
            touchState.dx = 0;
            touchState.dy = 0;
        };

        const onPointerMove = (e) => {
            if (isDesktop) return;
            if (!touchState.active) return;
            if (e.pointerType !== 'touch') return;

            touchState.dx = e.clientX - touchState.startX;
            touchState.dy = e.clientY - touchState.startY;

            const absDx = Math.abs(touchState.dx);
            const absDy = Math.abs(touchState.dy);

            if (absDx > absDy && absDx > 8) {
                e.preventDefault();
            }
        };

        const finishSwipe = () => {
            if (!touchState.active) return;

            const { dx, dy } = touchState;
            touchState.active = false;

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDx < 30 || absDx < absDy) return;

            const dir = dx < 0 ? +1 : -1;
            stepBySwipe(dir);
        };

        const onPointerUp = (e) => {
            if (isDesktop) return;
            if (e.pointerType !== 'touch') return;
            finishSwipe();
        };

        const onPointerCancel = (e) => {
            if (isDesktop) return;
            if (e.pointerType !== 'touch') return;
            finishSwipe();
        };

        const init = () => {
            updateEndEps();

            if (cardsFocused) {
                const off = clampOffset(getOffset());
                setOffset(off);
                gsap.set(container, { x: -off, force3D: true });
                enableVLock();

                const markers = getMarkers();
                if (markers.length) {
                    const idx = getActiveIndex();
                    const safeIdx = idx < 0 ? 0 : idx;
                    setActiveAttr(safeIdx);
                    emitActiveYear(markers[safeIdx]?.getAttribute('data-year') || null, false);

                    if (off <= START_FORCE_PX) {
                        setActiveAttr(0);
                        emitActiveYear(markers[0]?.getAttribute('data-year') || null, false);
                    }
                }

                if (isAtEndWith(off)) {
                    yearsHiddenBecauseEnd = true;
                    hideYearsScale?.(true);
                } else {
                    yearsHiddenBecauseEnd = false;
                }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        peekCards.applyPeekStateForRightEdgeCards();
                        peekCards.primePeekCard();
                    });
                });
            } else {
                yearsHiddenBecauseEnd = false;
                disableVLock();

                peekCards.killPeekTween();
                travelFinish();

                let cards = [];
                try {
                    cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
                } catch {
                    cards = [];
                }
                for (const card of cards) clearCardSplit(card);

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

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    peekCards.applyPeekStateForRightEdgeCards();
                    peekCards.primePeekCard();
                });
            });
        };

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheelCapture, { passive: false, capture: true });
        window.addEventListener('history:scrollToOffset', onExternalScrollToOffset);

        if (!isDesktop && typeof window !== 'undefined' && 'PointerEvent' in window) {
            container.addEventListener('pointerdown', onPointerDown, { passive: true });
            container.addEventListener('pointermove', onPointerMove, { passive: false });
            container.addEventListener('pointerup', onPointerUp, { passive: true });
            container.addEventListener('pointercancel', onPointerCancel, { passive: true });
        }

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('wheel', onWheelCapture, { capture: true });
            window.removeEventListener('history:scrollToOffset', onExternalScrollToOffset);

            if (!isDesktop && typeof window !== 'undefined' && 'PointerEvent' in window) {
                container.removeEventListener('pointerdown', onPointerDown);
                container.removeEventListener('pointermove', onPointerMove);
                container.removeEventListener('pointerup', onPointerUp);
                container.removeEventListener('pointercancel', onPointerCancel);
            }

            disableVLock();

            peekCards.killPeekTween();
            travelFinish();

            let cards = [];
            try {
                cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
            } catch {
                cards = [];
            }
            for (const card of cards) clearCardSplit(card);

            gsap.killTweensOf(container);
        };
    }, [
        isDesktop,
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
        hideHistoryTag,
        showAndPlaceHistoryTag,
    ]);
}
