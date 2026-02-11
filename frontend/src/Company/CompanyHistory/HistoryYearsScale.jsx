import React, {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import gsap from 'gsap';
import styles from './HistoryYearsScale.module.scss';
import strelka from '../icons/strelka.svg';

function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

function uniqYears(arr) {
    const out = [];
    const s = new Set();
    for (const y of arr || []) {
        const yy = y == null ? null : String(y);
        if (!yy) continue;
        if (!s.has(yy)) {
            s.add(yy);
            out.push(yy);
        }
    }
    return out;
}

function buildModel({ years, windowStart, windowSize = 5 }) {
    const n = years.length;

    if (!n) {
        return {
            mode: 'empty',
            first: null,
            last: null,
            leftSlot: null,
            rightSlot: null,
            centerYears: [],
            windowStart: 0,
            minStart: 0,
            maxStart: 0,
            canLeft: false,
            canRight: false,
        };
    }

    if (n <= 7) {
        return {
            mode: 'all',
            first: null,
            last: null,
            leftSlot: null,
            rightSlot: null,
            centerYears: years.map(String),
            windowStart: 0,
            minStart: 0,
            maxStart: 0,
            canLeft: false,
            canRight: false,
        };
    }

    const ys = years.map(String);
    const first = ys[0];
    const last = ys[n - 1];

    const minStart = 1;
    const maxStart = Math.max(1, n - 2 - (windowSize - 1));
    const ws = clamp(windowStart ?? 1, minStart, maxStart);

    const baseCanLeft = ws > minStart;
    const baseCanRight = ws < maxStart;

    const leftSlotBase = baseCanLeft ? { type: 'dots', dir: 'left' } : { type: 'year', value: ys[1] };
    const rightSlotBase = baseCanRight ? { type: 'dots', dir: 'right' } : { type: 'year', value: ys[n - 2] };

    const forbidden = new Set([first, last]);
    if (leftSlotBase.type === 'year') forbidden.add(String(leftSlotBase.value));
    if (rightSlotBase.type === 'year') forbidden.add(String(rightSlotBase.value));

    let center = ys.slice(ws, ws + windowSize).filter((y) => !forbidden.has(y));

    let r = ws + windowSize;
    while (center.length < windowSize && r <= n - 2) {
        const y = ys[r];
        if (!forbidden.has(y) && !center.includes(y)) center.push(y);
        r += 1;
    }

    let l = ws - 1;
    while (center.length < windowSize && l >= 1) {
        const y = ys[l];
        if (!forbidden.has(y) && !center.includes(y)) center.unshift(y);
        l -= 1;
    }

    if (center.length > windowSize) center = center.slice(0, windowSize);

    const nearLeft = ys[1];
    const nearRight = ys[n - 2];

    let leftSlot = leftSlotBase;
    let rightSlot = rightSlotBase;
    let canLeft = baseCanLeft;
    let canRight = baseCanRight;

    if (leftSlot?.type === 'dots' && center.includes(nearLeft)) {
        leftSlot = null;
        canLeft = false;
    }

    if (rightSlot?.type === 'dots' && center.includes(nearRight)) {
        rightSlot = null;
        canRight = false;
    }

    return {
        mode: 'window',
        first,
        last,
        leftSlot,
        rightSlot,
        centerYears: center,
        windowStart: ws,
        minStart,
        maxStart,
        canLeft,
        canRight,
    };
}

const HistoryYearsScale = forwardRef(function HistoryYearsScale(
    { years = [], timelineWrapperRef, horizontalOffsetRef, visible = true, onSkip },
    barRef
) {
    const allYears = useMemo(() => uniqYears(years).map(String), [years]);
    const yearsKey = useMemo(() => allYears.join('|'), [allYears]);

    const [uiYear, setUiYear] = useState(allYears[0] ?? null);
    const [windowStart, setWindowStart] = useState(1);

    const rootRef = useRef(null);
    const trackRef = useRef(null);

    const lockRef = useRef(false);
    const shiftingRef = useRef(false);

    const rafLoopRef = useRef(0);
    const lastOffsetRef = useRef(-1);

    const forcedYearRef = useRef(null);
    const forcedOffsetRef = useRef(null);

    const [tickWidth, setTickWidth] = useState(null);
    const measureYearRefs = useRef([]);
    const measureDotsRef = useRef(null);
    const scheduleMeasure = useRef(0);

    const ACTIVE_X = 60;

    const pretriggerRef = useRef(220);
    const endEpsRef = useRef(260);

    const PRETRIGGER_RATIO = 0.75;
    const PRETRIGGER_EXTRA_PX = 120;
    const PRETRIGGER_MIN = 80;
    const PRETRIGGER_MAX = 520;

    const END_EPS_RATIO = 0.8;
    const END_EPS_EXTRA_PX = 160;
    const END_EPS_MIN = 120;
    const END_EPS_MAX = 700;

    const ACTIVE_SCALE = 33 / 22;
    const NORMAL_SCALE = 1;

    const measureTickWidth = useCallback(() => {
        cancelAnimationFrame(scheduleMeasure.current);
        scheduleMeasure.current = requestAnimationFrame(() => {
            const els = measureYearRefs.current.filter(Boolean);
            const dotsEl = measureDotsRef.current;

            if (!els.length && !dotsEl) return;

            let maxW = 0;
            for (const el of els) maxW = Math.max(maxW, el.offsetWidth || 0);
            if (dotsEl) maxW = Math.max(maxW, dotsEl.offsetWidth || 0);

            if (!maxW) return;

            const next = Math.ceil(maxW) + 2;
            setTickWidth((prev) => (prev === next ? prev : next));
        });
    }, []);

    useLayoutEffect(() => {
        measureYearRefs.current = [];
    }, [yearsKey]);

    useLayoutEffect(() => {
        let alive = true;

        const run = async () => {
            measureTickWidth();
            try {
                if (document.fonts && document.fonts.ready) {
                    await document.fonts.ready;
                    if (!alive) return;
                    measureTickWidth();
                }
            } catch { }
        };

        run();

        const onResize = () => measureTickWidth();
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            alive = false;
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(scheduleMeasure.current);
        };
    }, [measureTickWidth]);

    useEffect(() => {
        if (!barRef) return;
        if (typeof barRef === 'function') barRef(rootRef.current);
        else barRef.current = rootRef.current;
    }, [barRef]);

    useEffect(() => {
        if (!allYears.length) return;
        setUiYear(allYears[0]);
        setWindowStart(1);
        lockRef.current = false;
        shiftingRef.current = false;
        forcedYearRef.current = null;
        forcedOffsetRef.current = null;
        lastOffsetRef.current = -1;
        measureTickWidth();
    }, [yearsKey, allYears, measureTickWidth]);

    const getCurrentOffset = useCallback(() => {
        return horizontalOffsetRef?.current != null ? Number(horizontalOffsetRef.current || 0) : 0;
    }, [horizontalOffsetRef]);

    const getMarkers = useCallback(() => {
        const container = timelineWrapperRef?.current;
        if (!container) return [];
        return Array.from(container.querySelectorAll('[data-year-marker="true"][data-year]'));
    }, [timelineWrapperRef]);

    const updatePretrigger = useCallback(() => {
        const markers = getMarkers();
        if (markers.length >= 2) {
            const c0 = markers[0].offsetLeft + markers[0].offsetWidth / 2;
            const c1 = markers[1].offsetLeft + markers[1].offsetWidth / 2;
            const step = Math.max(1, c1 - c0);

            const pre = clamp(step * PRETRIGGER_RATIO + PRETRIGGER_EXTRA_PX, PRETRIGGER_MIN, PRETRIGGER_MAX);
            const endEps = clamp(step * END_EPS_RATIO + END_EPS_EXTRA_PX, END_EPS_MIN, END_EPS_MAX);

            pretriggerRef.current = pre;
            endEpsRef.current = endEps;
        } else {
            pretriggerRef.current = 220;
            endEpsRef.current = 260;
        }
    }, [getMarkers]);

    useEffect(() => {
        const id = requestAnimationFrame(() => updatePretrigger());
        const onResize = () => requestAnimationFrame(() => updatePretrigger());
        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener('resize', onResize);
        };
    }, [yearsKey, updatePretrigger]);

    const setActiveDot = useCallback(
        (year) => {
            const container = timelineWrapperRef?.current;
            if (!container) return;

            const yy = year == null ? null : String(year);
            const markers = getMarkers();
            if (!markers.length) return;

            for (const m of markers) {
                const y = m.getAttribute('data-year');
                const isActive = yy && y === yy;

                if (isActive) m.setAttribute('data-active', 'true');
                else m.removeAttribute('data-active');

                const dot = m.querySelector('[data-year-dot="true"]');
                if (!dot) continue;

                gsap.killTweensOf(dot);
                gsap.killTweensOf(m);

                const toScale = isActive ? ACTIVE_SCALE : NORMAL_SCALE;

                gsap.to(dot, {
                    duration: 0.25,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    '--dot-scale': toScale,
                });

                gsap.to(m, {
                    duration: 0.25,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    '--dot-cutout-scale': toScale,
                });
            }
        },
        [timelineWrapperRef, getMarkers]
    );

    const computeActiveYearByLeftEdge = useCallback(() => {
        const markers = getMarkers();
        if (!markers.length) return null;

        const container = timelineWrapperRef?.current;
        const offset = getCurrentOffset();

        if (container) {
            const maxOffset = Math.max(0, container.scrollWidth - window.innerWidth);
            const endEps = Number(endEpsRef.current || 0);
            if (offset >= maxOffset - endEps) {
                const last = markers[markers.length - 1];
                return last?.getAttribute('data-year') || null;
            }
        }

        const edgeX = offset + ACTIVE_X + Number(pretriggerRef.current || 0);

        let best = null;
        let bestDelta = Infinity;

        for (const el of markers) {
            const year = el.getAttribute('data-year');
            if (!year) continue;

            const elCenter = el.offsetLeft + el.offsetWidth / 2;
            const delta = elCenter - edgeX;

            if (delta >= 0 && delta < bestDelta) {
                bestDelta = delta;
                best = year;
            }
        }

        if (!best) {
            const last = markers[markers.length - 1];
            best = last?.getAttribute('data-year') || null;
        }

        return best;
    }, [getMarkers, getCurrentOffset, timelineWrapperRef]);

    const applyActiveFromTimeline = useCallback(() => {
        if (!allYears.length) return;

        const container = timelineWrapperRef?.current;
        if (!container) {
            const y0 = allYears[0];
            setUiYear(y0);
            setWindowStart(1);
            setActiveDot(y0);
            return;
        }

        const y = computeActiveYearByLeftEdge();
        if (!y) return;

        const yy = String(y);
        if (!allYears.includes(yy)) return;

        setUiYear((prev) => (prev === yy ? prev : yy));
        setActiveDot(yy);

        if (allYears.length > 7) {
            const idx = allYears.indexOf(yy);
            const minStart = 1;
            const maxStart = Math.max(1, allYears.length - 2 - (5 - 1));
            const targetWs = clamp(idx - 2, minStart, maxStart);
            setWindowStart((prev) => (prev === targetWs ? prev : targetWs));
        } else {
            setWindowStart(1);
        }
    }, [allYears, timelineWrapperRef, computeActiveYearByLeftEdge, setActiveDot]);
   
    const scrollToYear = useCallback(
        (year) => {
            const container = timelineWrapperRef?.current;
            if (!container) return;

            const y = String(year);

            let targetEl = null;
            try {
                targetEl = container.querySelector(`[data-year-marker="true"][data-year="${y}"]`);
            } catch {
                targetEl = null;
            }
            if (!targetEl) return;

            const targetCenter = targetEl.offsetLeft + targetEl.offsetWidth / 2;

            const maxOffset = Math.max(0, container.scrollWidth - window.innerWidth);

            const pre = Number(pretriggerRef.current || 0);
            const edgeX = ACTIVE_X + pre;

            let targetOffset = targetCenter - edgeX;
            if (!Number.isFinite(targetOffset)) targetOffset = 0;

            targetOffset = clamp(targetOffset, 0, maxOffset);

            lockRef.current = true;
            forcedYearRef.current = y;
            forcedOffsetRef.current = null;

            setUiYear(y);
            setActiveDot(y);

            gsap.killTweensOf(container);
            gsap.to(container, {
                x: -targetOffset,
                duration: 0.85,
                ease: 'power2.out',
                overwrite: 'auto',
                force3D: true,
                onUpdate: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    const off = Math.max(0, -x);
                    if (horizontalOffsetRef) horizontalOffsetRef.current = off;
                },
                onComplete: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    const off = Math.max(0, -x);

                    if (horizontalOffsetRef) horizontalOffsetRef.current = off;
                    lastOffsetRef.current = off;

                    forcedYearRef.current = y;
                    forcedOffsetRef.current = off;

                    lockRef.current = false;

                    requestAnimationFrame(() => {
                        setUiYear(y);
                        setActiveDot(y);
                    });
                },
            });
        },
        [timelineWrapperRef, horizontalOffsetRef, setActiveDot]
    );

    useEffect(() => {
        if (!visible) return;

        cancelAnimationFrame(rafLoopRef.current);

        const loop = () => {
            rafLoopRef.current = requestAnimationFrame(loop);

            if (lockRef.current) return;
            if (shiftingRef.current) return;

            const off = getCurrentOffset();
            if (!Number.isFinite(off)) return;

            if (forcedYearRef.current && forcedOffsetRef.current != null) {
                if (Math.abs(off - forcedOffsetRef.current) <= 0.5) return;
                forcedYearRef.current = null;
                forcedOffsetRef.current = null;
                lastOffsetRef.current = -1;
            }

            if (Math.abs(off - lastOffsetRef.current) > 0.5) {
                lastOffsetRef.current = off;
                applyActiveFromTimeline();
            }
        };

        rafLoopRef.current = requestAnimationFrame(loop);

        const onResize = () => {
            lastOffsetRef.current = -1;
            requestAnimationFrame(() => applyActiveFromTimeline());
        };

        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(rafLoopRef.current);
        };
    }, [visible, getCurrentOffset, applyActiveFromTimeline]);

    const model = useMemo(() => {
        return buildModel({
            years: allYears,
            windowStart,
            windowSize: 5,
        });
    }, [allYears, windowStart]);

    useEffect(() => {
        if (allYears.length <= 7) return;
        if (lockRef.current) return;
        if (model.mode !== 'window') return;

        const idx = allYears.indexOf(String(uiYear));
        if (idx < 0) return;

        const targetWs = clamp(idx - 2, model.minStart, model.maxStart);
        setWindowStart((prev) => (prev === targetWs ? prev : targetWs));
    }, [uiYear, allYears, model.mode, model.minStart, model.maxStart]);

    const getStep = useCallback(() => {
        const track = trackRef.current;
        if (!track) return 48;
        const btns = Array.from(track.querySelectorAll('button[data-center="true"]'));
        if (btns.length >= 2) {
            const r0 = btns[0].getBoundingClientRect();
            const r1 = btns[1].getBoundingClientRect();
            const d = r1.left - r0.left;
            if (Number.isFinite(d) && d > 10) return d;
        }
        return 48;
    }, []);

    const pickNextHiddenYear = useCallback(
        (dir, m) => {
            if (!allYears.length) return null;

            const lastIndex = allYears.length - 1;

            const visibleSet = new Set();
            if (m.first) visibleSet.add(String(m.first));
            if (m.last) visibleSet.add(String(m.last));
            if (m.leftSlot?.type === 'year') visibleSet.add(String(m.leftSlot.value));
            if (m.rightSlot?.type === 'year') visibleSet.add(String(m.rightSlot.value));
            for (const y of m.centerYears || []) visibleSet.add(String(y));

            const idxs = [];
            for (const y of visibleSet) {
                const i = allYears.indexOf(String(y));
                if (i >= 0) idxs.push(i);
            }

            const innerIdxs = idxs.filter((i) => i > 0 && i < lastIndex);
            const minInner = innerIdxs.length ? Math.min(...innerIdxs) : 1;
            const maxInner = innerIdxs.length ? Math.max(...innerIdxs) : lastIndex - 1;

            if (dir === 'right') {
                for (let i = maxInner + 1; i < lastIndex; i += 1) {
                    const y = String(allYears[i]);
                    if (!visibleSet.has(y)) return y;
                }
                return null;
            }

            for (let i = minInner - 1; i > 0; i -= 1) {
                const y = String(allYears[i]);
                if (!visibleSet.has(y)) return y;
            }
            return null;
        },
        [allYears]
    );

    const onDotsClick = useCallback(
        (dir) => {
            if (model.mode !== 'window') return;
            if (shiftingRef.current) return;

            if (dir === 'right' && !model.canRight) return;
            if (dir === 'left' && !model.canLeft) return;

            const nextHidden = pickNextHiddenYear(dir, model);
            if (!nextHidden) return;

            const idx = allYears.indexOf(String(nextHidden));
            if (idx < 0) return;

            const targetWs = clamp(idx - 2, model.minStart, model.maxStart);

            const track = trackRef.current;
            if (!track) return;

            shiftingRef.current = true;
            lockRef.current = true;

            gsap.killTweensOf(track);

            const step = getStep();
            const xTo = dir === 'right' ? -step : step;

            gsap.to(track, {
                x: xTo,
                duration: 0.28,
                ease: 'power2.inOut',
                overwrite: true,
                force3D: true,
                onComplete: () => {
                    setWindowStart(targetWs);
                    gsap.set(track, { x: 0, clearProps: 'transform' });
                    shiftingRef.current = false;
                    requestAnimationFrame(() => {
                        lockRef.current = false;
                    });
                },
            });
        },
        [model, pickNextHiddenYear, allYears, getStep]
    );

    const isActuallyVisible = visible && allYears.length > 0;
    const tickStyle = tickWidth ? { width: `${tickWidth}px` } : undefined;

    const renderYearBtn = (year, isCenter = false) => {
        const yy = String(year);
        const isActive = String(uiYear) === yy;

        return (
            <button
                key={yy}
                type="button"
                className={`${styles.tick} ${isActive ? styles.active : ''}`}
                onClick={() => scrollToYear(yy)}
                data-center={isCenter ? 'true' : undefined}
                style={tickStyle}
            >
                <span className={styles.label}>{yy}</span>
                <span className={styles.mark} aria-hidden="true" />
            </button>
        );
    };

    const renderDotsBtn = (dir, disabled) => (
        <button
            type="button"
            className={`${styles.tick} ${styles.dotsTick}`}
            onClick={() => onDotsClick(dir)}
            disabled={disabled}
            aria-label={dir === 'right' ? 'Показать следующие годы' : 'Показать предыдущие годы'}
            style={tickStyle}
        >
            <span className={styles.dotsLabel} aria-hidden="true">
                …
            </span>
            <span className={styles.mark} aria-hidden="true" />
        </button>
    );

    return (
        <div
            ref={rootRef}
            className={styles.fixed_bar}
            style={{
                opacity: isActuallyVisible ? 1 : 0,
                pointerEvents: isActuallyVisible ? 'auto' : 'none',
                transform: isActuallyVisible ? 'translateY(0)' : 'translateY(40px)',
                visibility: 'visible',
                display: 'block',
            }}
            aria-hidden={!isActuallyVisible}
        >
            <div
                style={{
                    position: 'absolute',
                    left: -99999,
                    top: -99999,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                }}
                aria-hidden="true"
            >
                <button
                    ref={(el) => (measureDotsRef.current = el)}
                    type="button"
                    className={`${styles.tick} ${styles.dotsTick}`}
                >
                    <span className={styles.dotsLabel} aria-hidden="true">
                        …
                    </span>
                    <span className={styles.mark} aria-hidden="true" />
                </button>

                {allYears.map((y) => (
                    <button
                        key={`m-${y}`}
                        ref={(el) => {
                            if (el) measureYearRefs.current.push(el);
                        }}
                        type="button"
                        className={styles.tick}
                    >
                        <span className={styles.label}>{y}</span>
                        <span className={styles.mark} aria-hidden="true" />
                    </button>
                ))}
            </div>

            <div className={styles.inner}>
                <div className={styles.scale}>
                    <div className={styles.rail} />

                    {model.mode === 'all' ? (
                        <div className={styles.rowAll}>{model.centerYears.map((y) => renderYearBtn(y, false))}</div>
                    ) : model.mode === 'window' ? (
                        <div className={styles.rowFixed}>
                            <div className={styles.side}>
                                {renderYearBtn(model.first, false)}
                                {model.leftSlot?.type === 'dots'
                                    ? renderDotsBtn('left', !model.canLeft)
                                    : model.leftSlot?.type === 'year'
                                        ? renderYearBtn(model.leftSlot.value, false)
                                        : null}
                            </div>

                            <div className={styles.centerViewport}>
                                <div ref={trackRef} className={styles.centerTrack}>
                                    {model.centerYears.map((y) => renderYearBtn(y, true))}
                                </div>
                            </div>

                            <div className={styles.side}>
                                {model.rightSlot?.type === 'dots'
                                    ? renderDotsBtn('right', !model.canRight)
                                    : model.rightSlot?.type === 'year'
                                        ? renderYearBtn(model.rightSlot.value, false)
                                        : null}
                                {renderYearBtn(model.last, false)}
                            </div>
                        </div>
                    ) : null}
                </div>

                <button type="button" className={styles.skip} onClick={(e) => onSkip?.(e)} disabled={!onSkip}>
                    Пропустить <img className={styles.arrow} src={strelka} alt="" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
});

export default HistoryYearsScale;
