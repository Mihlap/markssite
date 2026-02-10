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
    const maxStart = Math.max(1, (n - 2) - (windowSize - 1));
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
    const rafRef = useRef(0);

    const lockRef = useRef(false);
    const shiftingRef = useRef(false);

    const [tickWidth, setTickWidth] = useState(null);
    const measureYearRefs = useRef([]);
    const measureDotsRef = useRef(null);
    const scheduleMeasure = useRef(0);

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

    const computeYearFromTimeline = useCallback(() => {
        const markers = getMarkers();
        if (!markers.length) return null;

        const offset = getCurrentOffset();
        const viewportCenterX = window.innerWidth / 2;
        const centerX = offset + viewportCenterX;

        let best = null;
        let bestDist = Infinity;

        for (const el of markers) {
            const year = el.getAttribute('data-year');
            if (!year) continue;

            const elCenter = el.offsetLeft + el.offsetWidth / 2;
            const d = Math.abs(elCenter - centerX);
            if (d < bestDist) {
                bestDist = d;
                best = year;
            }
        }

        return best;
    }, [getMarkers, getCurrentOffset]);

    const snapUiToTimeline = useCallback(() => {
        if (!allYears.length) return;

        const container = timelineWrapperRef?.current;
        if (!container) {
            setUiYear(allYears[0]);
            setWindowStart(1);
            return;
        }

        const offset = getCurrentOffset();
        const EPS = 12;

        if (offset <= EPS) {
            setUiYear(allYears[0]);
            setWindowStart(1);
            return;
        }

        const y = computeYearFromTimeline();
        if (!y) return;

        const yy = String(y);
        if (!allYears.includes(yy)) return;

        setUiYear(yy);

        if (allYears.length > 7) {
            const idx = allYears.indexOf(yy);
            const minStart = 1;
            const maxStart = Math.max(1, (allYears.length - 2) - (5 - 1));
            const targetWs = clamp(idx - 2, minStart, maxStart);
            setWindowStart((prev) => (prev === targetWs ? prev : targetWs));
        }
    }, [allYears, timelineWrapperRef, getCurrentOffset, computeYearFromTimeline]);

    const scrollToYear = useCallback(
        (year) => {
            const container = timelineWrapperRef?.current;
            if (!container) return;

            const y = String(year);
            const targetEl = container.querySelector(`[data-year-marker="true"][data-year="${y}"]`);
            if (!targetEl) return;

            const targetCenter = targetEl.offsetLeft + targetEl.offsetWidth / 2;
            const viewportCenterX = window.innerWidth / 2;

            const maxOffset = Math.max(0, container.scrollWidth - window.innerWidth);
            const targetOffset = clamp(targetCenter - viewportCenterX, 0, maxOffset);

            lockRef.current = false;

            gsap.killTweensOf(container);
            gsap.to(container, {
                x: -targetOffset,
                duration: 0.85,
                ease: 'power2.out',
                overwrite: 'auto',
                force3D: true,
                onUpdate: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    if (horizontalOffsetRef) horizontalOffsetRef.current = Math.max(0, -x);
                },
                onComplete: () => {
                    const x = Number(gsap.getProperty(container, 'x') || 0);
                    if (horizontalOffsetRef) horizontalOffsetRef.current = Math.max(0, -x);
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => snapUiToTimeline());
                    });
                },
            });

            setUiYear(y);
        },
        [timelineWrapperRef, horizontalOffsetRef, snapUiToTimeline]
    );

    useEffect(() => {
        if (!visible) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => snapUiToTimeline());
        });

        const onAnyMove = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                if (lockRef.current) return;
                snapUiToTimeline();
            });
        };

        window.addEventListener('resize', onAnyMove, { passive: true });
        window.addEventListener('wheel', onAnyMove, { passive: true });

        return () => {
            window.removeEventListener('resize', onAnyMove);
            window.removeEventListener('wheel', onAnyMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [visible, snapUiToTimeline]);

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
