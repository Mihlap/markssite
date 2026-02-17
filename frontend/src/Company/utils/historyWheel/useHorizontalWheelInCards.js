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
    isModalOpen = false,
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

        const SHIFT_X = 26;

        const PEEK_MIN_VISIBLE = 24;
        const PEEK_MAX_VISIBLE = 260;

        const isPeekCard = (rect, vw) => {
            const intersectsRightEdge = rect.left < vw && rect.right > vw;
            if (!intersectsRightEdge) return false;

            const visibleW = vw - rect.left;
            if (visibleW < PEEK_MIN_VISIBLE || visibleW > PEEK_MAX_VISIBLE) return false;

            return true;
        };

        const getSplitNodes = (card) => {
            if (!card) return null;
            const left = card.querySelector('[data-split-left="true"]');
            const right = card.querySelector('[data-split-right="true"]');
            if (!left || !right) return null;
            return { left, right };
        };

        const clearCardSplit = (card) => {
            const nodes = getSplitNodes(card);
            if (!nodes) return;

            gsap.killTweensOf(nodes.left);
            gsap.killTweensOf(nodes.right);

            gsap.set(nodes.left, { clearProps: 'transform' });
            gsap.set(nodes.right, { clearProps: 'transform' });

            try {
                card.removeAttribute('data-peek-primed');
                card.removeAttribute('data-peek-snapped');
            } catch { }
        };

        const applyPeekStateForRightEdgeCards = () => {
            const vw = window.innerWidth || 0;

            let cards = [];
            try {
                cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
            } catch {
                cards = [];
            }
            if (!cards.length) return;

            for (const card of cards) {
                const r = card.getBoundingClientRect();
                const shouldBePeek = isPeekCard(r, vw);

                if (!shouldBePeek) {
                    try {
                        if (card.getAttribute('data-peek-primed') === 'true') {
                            card.removeAttribute('data-peek-primed');
                            if (card.getAttribute('data-peek-snapped') !== 'true') {
                                const nodes = getSplitNodes(card);
                                if (nodes) {
                                    gsap.killTweensOf(nodes.left);
                                    gsap.killTweensOf(nodes.right);
                                    gsap.set(nodes.left, { clearProps: 'transform' });
                                    gsap.set(nodes.right, { clearProps: 'transform' });
                                }
                            }
                        }
                    } catch { }
                    continue;
                }

                if (card.getAttribute('data-peek-snapped') === 'true') continue;
                if (card.getAttribute('data-peek-primed') === 'true') continue;

                const nodes = getSplitNodes(card);
                if (!nodes) continue;

                gsap.killTweensOf(nodes.left);
                gsap.killTweensOf(nodes.right);

                gsap.set(nodes.left, { x: -SHIFT_X, force3D: true });
                gsap.set(nodes.right, { x: +SHIFT_X, force3D: true });

                try {
                    card.setAttribute('data-peek-primed', 'true');
                } catch { }
            }
        };

        const findBestPeekCard = () => {
            const vw = window.innerWidth || 0;

            let cards = [];
            try {
                cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
            } catch {
                cards = [];
            }
            if (!cards.length) return null;

            let best = null;
            let bestScore = Infinity;

            for (const card of cards) {
                const r = card.getBoundingClientRect();
                if (!isPeekCard(r, vw)) continue;

                const visibleW = vw - r.left;
                const score = Math.abs(visibleW - 120);
                if (score < bestScore) {
                    bestScore = score;
                    best = card;
                }
            }

            return best;
        };

        const peekStateRef = {
            current: {
                primedCard: null,
                primedLeft: null,
                primedRight: null,
                tl: null,
                start: 0,
                end: 0,
                animating: false,
            },
        };

        const killPeekTween = () => {
            const st = peekStateRef.current;
            if (st.tl) {
                try {
                    st.tl.kill();
                } catch { }
            }
            st.tl = null;
            st.start = 0;
            st.end = 0;
            st.animating = false;
        };

        const primePeekCard = () => {
            const st = peekStateRef.current;
            if (st.animating) return;

            applyPeekStateForRightEdgeCards();

            const card = findBestPeekCard();
            if (!card) return;

            if (st.primedCard === card) {
                const nodes = getSplitNodes(card);
                if (nodes) {
                    st.primedLeft = nodes.left;
                    st.primedRight = nodes.right;
                }
                return;
            }

            if (st.primedCard && st.primedCard !== card) {
                st.primedCard = null;
                st.primedLeft = null;
                st.primedRight = null;
            }

            const nodes = getSplitNodes(card);
            if (!nodes) {
                st.primedCard = null;
                st.primedLeft = null;
                st.primedRight = null;
                return;
            }

            if (card.getAttribute('data-peek-snapped') !== 'true') {
                gsap.set(nodes.left, { x: -SHIFT_X, force3D: true });
                gsap.set(nodes.right, { x: +SHIFT_X, force3D: true });
                try {
                    card.setAttribute('data-peek-primed', 'true');
                } catch { }
            }

            st.primedCard = card;
            st.primedLeft = nodes.left;
            st.primedRight = nodes.right;
        };

        const armPeekForSnap = (startOffset, endOffset) => {
            const st = peekStateRef.current;

            killPeekTween();
            primePeekCard();

            if (!st.primedCard || !st.primedLeft || !st.primedRight) return;

            try {
                st.primedCard.setAttribute('data-peek-snapped', 'true');
            } catch { }

            st.animating = true;
            st.start = Number(startOffset || 0);
            st.end = Number(endOffset || 0);

            const tl = gsap.timeline({ paused: true });
            tl.to(st.primedLeft, { x: 0, ease: 'none', duration: 1 }, 0);
            tl.to(st.primedRight, { x: 0, ease: 'none', duration: 1 }, 0);

            st.tl = tl;
        };

        const updatePeekProgress = (currentOffset) => {
            const st = peekStateRef.current;
            if (!st.tl || !st.animating) return;

            const s = Number(st.start || 0);
            const e = Number(st.end || 0);
            const denom = e - s;

            if (!Number.isFinite(denom) || Math.abs(denom) < 0.0001) {
                st.tl.progress(1);
                return;
            }

            const p = (Number(currentOffset || 0) - s) / denom;
            const pp = Math.max(0, Math.min(1, p));
            st.tl.progress(pp);
        };

        const finishPeekSnap = () => {
            const st = peekStateRef.current;
            if (st.tl) st.tl.progress(1);

            if (st.primedCard) {
                const nodes = getSplitNodes(st.primedCard);
                if (nodes) {
                    gsap.killTweensOf(nodes.left);
                    gsap.killTweensOf(nodes.right);
                    gsap.set(nodes.left, { clearProps: 'transform' });
                    gsap.set(nodes.right, { clearProps: 'transform' });
                }

                try {
                    st.primedCard.removeAttribute('data-peek-primed');
                    st.primedCard.setAttribute('data-peek-snapped', 'true');
                } catch { }
            }

            killPeekTween();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    let cards = [];
                    try {
                        cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
                    } catch {
                        cards = [];
                    }
                    for (const card of cards) {
                        try {
                            card.removeAttribute('data-peek-snapped');
                        } catch { }
                    }

                    applyPeekStateForRightEdgeCards();
                    primePeekCard();
                });
            });
        };

        const DOT_ACTIVE_PX = 30;
        const DOT_OVERSHOOT_PX = 40;

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
            const activeScale = Math.max(1, DOT_ACTIVE_PX / base);
            const overScale = Math.max(activeScale, DOT_OVERSHOOT_PX / base);

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

            const peakAt = 0.72;

            const smooth = (x) => x * x * (3 - 2 * x);
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

        const applyOffset = (next, immediate = false, onDone, opts = null) => {
            const clamped = clampOffset(next);
            const startOffset = getOffset();

            const dur = opts && Number.isFinite(opts.duration) ? Number(opts.duration) : DUR;
            const ease = opts && opts.ease ? String(opts.ease) : EASE;

            setOffset(clamped);

            gsap.killTweensOf(container);

            if (immediate) {
                killPeekTween();
                gsap.set(container, { x: -clamped, force3D: true });
                applyPeekStateForRightEdgeCards();
                primePeekCard();
                travelFinish();
                onDone?.(clamped);
                return;
            }

            if (Math.abs(clamped - startOffset) > 8) {
                armPeekForSnap(startOffset, clamped);
            } else {
                killPeekTween();
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

                    applyPeekStateForRightEdgeCards();
                    updatePeekProgress(off);

                    travelUpdate(tween.progress());
                },
                onComplete: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    const off = Math.max(0, -x);
                    setOffset(off);
                    finishPeekSnap();
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
            travelArm(markers[0] || null);

            applyOffset(0, immediate, () => {
                setActiveAttr(0);
                emitActiveYear(y0, false);
                travelFinish();
            });
        };

        const getClosestIndexToTargetX = () => {
            const markers = getMarkers();
            if (!markers.length) return -1;

            const off = getOffset();

            if (off <= START_SNAP_PX) return 0;

            const edgeX = off + TARGET_DOT_X;

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
            const { immediate = false } = opts;

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
            emitActiveYear(year, false);

            travelArm(el);

            applyOffset(targetOffset, immediate, (off) => {
                emitActiveYear(year, false);

                const atEnd = i >= markers.length - 1 || isAtEndWith(off);
                if (atEnd) {
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
            });

            const after = targetOffset;
            if (i >= markers.length - 1 || isAtEndWith(after)) {
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

            if (dir > 0 && (cur >= markers.length - 1 || isAtEndWith(getOffset()))) {
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
            if (isModalOpen) return;

            if (e?.target) {
                const target = e.target;
                const modalElement = target.closest?.('[class*="modal"]') ||
                    target.closest?.('[class*="Modal"]') ||
                    target.closest?.('[class*="ReactModal"]') ||
                    target.closest?.('[role="dialog"]');
                if (modalElement) return;
            }

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
                if (isAtEndWith(getOffset())) {
                    allowVerticalScrollDownAtEnd();
                    return;
                }
                stepByWheel(+1, e);
                return;
            }

            if (raw < 0) {           
                const currentOffset = getOffset();
                if (currentOffset > 0.1) {              
                    stopWheelHard(e);
                    stepByWheel(-1, e);
                    return;
                }
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
                        applyPeekStateForRightEdgeCards();
                        primePeekCard();
                    });
                });
            } else {
                yearsHiddenBecauseEnd = false;
                disableVLock();

                killPeekTween();
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
                    applyPeekStateForRightEdgeCards();
                    primePeekCard();
                });
            });
        };

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheelCapture, { passive: false, capture: true });
        window.addEventListener('history:scrollToOffset', onExternalScrollToOffset);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('wheel', onWheelCapture, { capture: true });
            window.removeEventListener('history:scrollToOffset', onExternalScrollToOffset);

            disableVLock();

            killPeekTween();
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
