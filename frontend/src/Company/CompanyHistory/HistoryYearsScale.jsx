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
    { years = [], timelineWrapperRef, horizontalOffsetRef, visible = true, onSkip, isModalOpen = false },
    barRef
) {
    const allYears = useMemo(() => uniqYears(years).map(String), [years]);
    const yearsKey = useMemo(() => allYears.join('|'), [allYears]);

    const [uiYear, setUiYear] = useState(allYears[0] ?? null);
    const [windowStart, setWindowStart] = useState(1);

    const rootRef = useRef(null);
    const scaleRef = useRef(null);

    const lockRef = useRef(false);

    const scrollTokenRef = useRef(null);

    const [tickWidth, setTickWidth] = useState(null);
    const measureYearRefs = useRef([]);
    const measureDotsRef = useRef(null);
    const scheduleMeasure = useRef(0);

    const lastAnimatedYearRef = useRef(null);
    const lastAnimatedAtRef = useRef(0);

    const ACTIVE_TARGET_PX = 30;
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
        scrollTokenRef.current = null;
        lastAnimatedYearRef.current = null;
        lastAnimatedAtRef.current = 0;
        measureTickWidth();
    }, [yearsKey, allYears, measureTickWidth]);

    const getMarkers = useCallback(() => {
        const container = timelineWrapperRef?.current;
        if (!container) return [];
        return Array.from(container.querySelectorAll('[data-year-marker="true"][data-year]'));
    }, [timelineWrapperRef]);

    const animateDotsToActiveYear = useCallback(
        (year, pulse = false) => {
            const yy = year == null ? null : String(year);
            if (!yy) return;

            const now = Date.now();
            if (lastAnimatedYearRef.current === yy && now - lastAnimatedAtRef.current < 180) return;

            const markers = getMarkers();
            if (!markers.length) return;

            lastAnimatedYearRef.current = yy;
            lastAnimatedAtRef.current = now;

            for (const m of markers) {
                const y = m.getAttribute('data-year');
                const isActive = y === yy;

                const dot = m.querySelector('[data-year-dot="true"]');
                if (!dot) continue;

                gsap.killTweensOf(dot);
                gsap.killTweensOf(m);

                const base = Number(dot.offsetWidth || 22) || 22;
                const activeScale = Math.max(1, ACTIVE_TARGET_PX / base);

                if (!isActive) {
                    gsap.to(dot, {
                        duration: 0.22,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        '--dot-scale': NORMAL_SCALE,
                    });
                    gsap.to(m, {
                        duration: 0.22,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        '--dot-cutout-scale': NORMAL_SCALE,
                    });
                    continue;
                }

                gsap.to(dot, {
                    duration: pulse ? 0.34 : 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    '--dot-scale': activeScale,
                });
                gsap.to(m, {
                    duration: pulse ? 0.34 : 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    '--dot-cutout-scale': activeScale,
                });
            }
        },
        [getMarkers]
    );

    useEffect(() => {
        const onActive = (ev) => {
            const d = ev?.detail || {};
            const y = d.year != null ? String(d.year) : null;
            if (!y) return;
            if (!allYears.includes(y)) return;

            setUiYear((prev) => (prev === y ? prev : y));

            if (allYears.length > 7) {
                const idx = allYears.indexOf(y);
                const minStart = 1;
                const maxStart = Math.max(1, allYears.length - 2 - (5 - 1));
                const targetWs = clamp(idx - 2, minStart, maxStart);
                setWindowStart((prev) => (prev === targetWs ? prev : targetWs));
            } else {
                setWindowStart(1);
            }

            animateDotsToActiveYear(y, Boolean(d.pulse));
        };

        window.addEventListener('history:activeYear', onActive);
        return () => window.removeEventListener('history:activeYear', onActive);
    }, [allYears, animateDotsToActiveYear]);

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

            const ACTIVE_X = 60;
            const edgeX = ACTIVE_X + 220;

            let targetOffset = targetCenter - edgeX;
            if (!Number.isFinite(targetOffset)) targetOffset = 0;
            targetOffset = clamp(targetOffset, 0, maxOffset);

            const token = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
            scrollTokenRef.current = token;

            lockRef.current = true;
            setUiYear(y);

            window.dispatchEvent(
                new CustomEvent('history:scrollToOffset', {
                    detail: {
                        token,
                        year: y,
                        targetOffset,
                        duration: 0.85,
                        ease: 'power2.out',
                    },
                })
            );
        },
        [timelineWrapperRef]
    );

    useEffect(() => {
        const onDone = (ev) => {
            const d = ev?.detail || {};
            if (!d.token) return;
            if (d.token !== scrollTokenRef.current) return;

            const off = Number(d.offset);
            if (Number.isFinite(off)) {
                if (horizontalOffsetRef) horizontalOffsetRef.current = off;
            }

            lockRef.current = false;
        };

        window.addEventListener('history:scrollToOffsetDone', onDone);
        return () => window.removeEventListener('history:scrollToOffsetDone', onDone);
    }, [horizontalOffsetRef]);

    const model = useMemo(() => {
        return buildModel({
            years: allYears,
            windowStart,
            windowSize: 5,
        });
    }, [allYears, windowStart]);

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
            if (dir === 'right' && !model.canRight) return;
            if (dir === 'left' && !model.canLeft) return;

            const nextHidden = pickNextHiddenYear(dir, model);
            if (!nextHidden) return;

            const idx = allYears.indexOf(String(nextHidden));
            if (idx < 0) return;

            const targetWs = clamp(idx - 2, model.minStart, model.maxStart);
            setWindowStart(targetWs);
        },
        [model, pickNextHiddenYear, allYears]
    );

    const isActuallyVisible = visible && allYears.length > 0;
    const tickStyle = tickWidth ? { width: `${tickWidth}px` } : undefined;

    useEffect(() => {
        if (isActuallyVisible) return;

        const root = rootRef.current;
        if (!root) return;

        const ae = document.activeElement;
        if (ae && root.contains(ae) && typeof ae.blur === 'function') {
            ae.blur();
        }
    }, [isActuallyVisible]);

    const updateGlowPosition = useCallback(() => {
        const scale = scaleRef.current;
        if (!scale) return;

        const activeTick = scale.querySelector(`.${styles.active}`);
        if (!activeTick) {
            scale.style.setProperty('--active-line-x', '-9999px');
            scale.style.setProperty('--active-line-size', '170px');
            return;
        }

        const scaleRect = scale.getBoundingClientRect();
        if (!scaleRect.width) return;

        const ticks = Array.from(scale.querySelectorAll(`.${styles.tick}`))
            .map((el) => {
                const r = el.getBoundingClientRect();
                return { el, center: r.left + r.width / 2 - scaleRect.left };
            })
            .sort((a, b) => a.center - b.center);

        const activeIdx = ticks.findIndex((t) => t.el === activeTick);
        if (activeIdx < 0) return;

        const active = ticks[activeIdx];
        const prev = activeIdx > 0 ? ticks[activeIdx - 1] : null;
        const next = activeIdx < ticks.length - 1 ? ticks[activeIdx + 1] : null;

        const labelEl = activeTick.querySelector(`.${styles.label}`);
        const labelWidth = labelEl ? labelEl.getBoundingClientRect().width : 0;
        const LABEL_EXTEND = labelWidth / 2 + 50;
        const MAX_RATIO = 0.99;
        const EDGE_EXTEND = 60;

        let lineLeft, lineRight;

        if (prev) {
            const maxLeft = active.center - (active.center - prev.center) * MAX_RATIO;
            const minLeft = active.center - LABEL_EXTEND;
            lineLeft = Math.min(maxLeft, minLeft);
        } else {
            lineLeft = Math.max(0, active.center - EDGE_EXTEND);
        }

        if (next) {
            const maxRight = active.center + (next.center - active.center) * MAX_RATIO;
            const minRight = active.center + LABEL_EXTEND;
            lineRight = Math.max(maxRight, minRight);
        } else {
            lineRight = Math.min(scaleRect.width, active.center + EDGE_EXTEND);
        }

        const lineSize = lineRight - lineLeft;
        const lineCenter = active.center;

        scale.style.setProperty('--active-line-x', `${lineCenter}px`);
        scale.style.setProperty('--active-line-size', `${lineSize}px`);
    }, []);

    useEffect(() => {
        updateGlowPosition();
        const timer = setTimeout(updateGlowPosition, 350);
        return () => clearTimeout(timer);
    }, [uiYear, model, updateGlowPosition]);

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
                zIndex: isModalOpen ? 1 : 2500,
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
                <div ref={scaleRef} className={styles.scale}>
                    <div className={styles.rail} />

                    {model.mode === 'all' ? (
                        <div className={styles.rowAll}>
                            {model.centerYears.map((y) => renderYearBtn(y, false))}
                        </div>
                    ) : model.mode === 'window' ? (
                        <div className={styles.rowFixed}>
                            {renderYearBtn(model.first, false)}
                            {model.leftSlot?.type === 'dots'
                                ? renderDotsBtn('left', !model.canLeft)
                                : model.leftSlot?.type === 'year'
                                    ? renderYearBtn(model.leftSlot.value, false)
                                    : null}
                            {model.centerYears.map((y) => renderYearBtn(y, true))}
                            {model.rightSlot?.type === 'dots'
                                ? renderDotsBtn('right', !model.canRight)
                                : model.rightSlot?.type === 'year'
                                    ? renderYearBtn(model.rightSlot.value, false)
                                    : null}
                            {renderYearBtn(model.last, false)}
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
