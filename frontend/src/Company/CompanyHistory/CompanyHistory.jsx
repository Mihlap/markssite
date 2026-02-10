import { useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import HistoryCard from './HistoryCard';
import CompanyHistoryHeader from './CompanyHistoryHeader';
import HistoryYearsScale from './HistoryYearsScale';

import { useCompanyHistoryHeaderIntro } from '../utils/useCompanyHistoryHeaderIntro';
import { useCompanyHistoryWheelHandlers } from '../utils/historyWheel/useCompanyHistoryWheelHandlers';
import { useCompanyHistoryAnimations } from '../utils/useCompanyHistoryAnimations';

import { fetchCompanyHistory } from '../../store/Slice/companyHistorySlice';
import styles from './CompanyHistory.module.scss';
import cityVector from '../icons/cityVector.svg';

gsap.registerPlugin(ScrollToPlugin);

export default function CompanyHistory({
    parentStartRef,
    sliderRef,
    externalHistoryHeaderRef,
    onExitToParentTop,
}) {
    const dispatch = useDispatch();
    const historyItems = useSelector((state) => state.companyHistory.items || []);
    const loading = useSelector((state) => state.companyHistory.loading);

    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const subtitleLineRef = useRef(null);
    const marksGroupRef = useRef(null);
    const subtitleLine1Ref = useRef(null);
    const subtitleLine2Ref = useRef(null);
    const backgroundRef = useRef(null);

    const historyListRef = useRef(null);
    const timelineWrapperRef = useRef(null);

    const historyTagRef = useRef(null);
    const internalHistoryHeaderRef = useRef(null);
    const historyHeaderRef = externalHistoryHeaderRef ?? internalHistoryHeaderRef;

    const hasSplitTriggered = useRef(false);
    const hasRestoreTriggered = useRef(false);
    const hasScrollToCardsTriggered = useRef(false);
    const hasScrollToHeaderTriggered = useRef(false);
    const textAnimationReady = useRef(false);

    const headerIntroArmedRef = useRef(true);
    const headerIntroInProgressRef = useRef(false);

    const cardsIntroTriggeredRef = useRef(false);
    const returnedToSliderRef = useRef(false);

    const cardsFocusInProgressRef = useRef(false);
    const exitToParentInProgressRef = useRef(false);

    const cardsTopRowRef = useRef(null);
    const yearsScaleRef = useRef(null);

    const horizontalOffsetRef = useRef(0);

    const [animationReady, setAnimationReady] = useState(false);
    const [cardsFocused, setCardsFocused] = useState(false);
    const [yearsScaleGate, setYearsScaleGate] = useState(true);
    const [viewRef, inView] = useInView({ threshold: 0.2, triggerOnce: true }); 
    const [timelineVisRef, timelineInView] = useInView({
        threshold: 0.15,
        triggerOnce: false,
    });

    useEffect(() => {
        return () => {
            hasSplitTriggered.current = false;
            hasRestoreTriggered.current = false;
            hasScrollToCardsTriggered.current = false;
            hasScrollToHeaderTriggered.current = false;
            textAnimationReady.current = false;
            headerIntroArmedRef.current = true;
            headerIntroInProgressRef.current = false;
            cardsIntroTriggeredRef.current = false;
            returnedToSliderRef.current = false;
            cardsFocusInProgressRef.current = false;
            exitToParentInProgressRef.current = false;

            if (sectionRef.current) sectionRef.current.removeAttribute('data-focus-layout');
        };
    }, []);

    useLayoutEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const apply = () => {
            const sbw = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
            el.style.setProperty('--sbw', `${sbw}px`);
        };

        apply();
        window.addEventListener('resize', apply);
        return () => window.removeEventListener('resize', apply);
    }, []);

    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;
        if (!cardsFocused) root.removeAttribute('data-focus-layout');
    }, [cardsFocused]);

    const visibleItems = useMemo(() => {
        return [...historyItems]
            .filter((item) => !item.hidden)
            .sort((a, b) => {
                const ao = a.order ?? 0;
                const bo = b.order ?? 0;
                if (ao !== bo) return ao - bo;
               
                const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                if (at !== bt) return at - bt;
              
                return String(a.id ?? '').localeCompare(String(b.id ?? ''));
            });
    }, [historyItems]);


    const { timelineItemsAdmin, cardsByYear, scaleYearsAsc } = useMemo(() => {   
        const yearsAdmin = [];
        const seen = new Set();

        for (const item of visibleItems) {
            if (item.year == null) continue;
            const ys = String(item.year);
            if (!seen.has(ys)) {
                seen.add(ys);
                yearsAdmin.push(ys);
            }
        }
    
        const grouped = {};
        for (const y of yearsAdmin) grouped[y] = { top: [], bottom: [] };

        let globalIndex = 0;
        for (const item of visibleItems) {
            if (item.year == null) continue;
            const y = String(item.year);
      
            if (!grouped[y]) grouped[y] = { top: [], bottom: [] };

            if (globalIndex % 2 === 0) grouped[y].top.push(item);
            else grouped[y].bottom.push(item);

            globalIndex += 1;
        }
        
        const yearsAsc = [...yearsAdmin].sort((a, b) => (Number(a) || 0) - (Number(b) || 0));

        return {
            timelineItemsAdmin: yearsAdmin,
            cardsByYear: grouped,
            scaleYearsAsc: yearsAsc,
        };
    }, [visibleItems]);


    useEffect(() => {
        dispatch(fetchCompanyHistory());
    }, [dispatch]);

    useCompanyHistoryHeaderIntro({
        inView,
        visibleItemsLength: visibleItems.length,
        historyListRef,
        historyHeaderRef,
        titleRef,
        marksGroupRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        hasSplitTriggered,
        hasScrollToHeaderTriggered,
        textAnimationReady,
        headerIntroArmedRef,
        headerIntroInProgressRef,
        cardsIntroTriggeredRef,
        setAnimationReady,
    });

    const {
        exitCardsFocus,
        showAndPlaceHistoryTag,
        hideHistoryTag,
        showYearsScale,
        hideYearsScale,
    } = useCompanyHistoryAnimations({
        historyHeaderRef,
        animationReady,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        backgroundRef,
        sectionRef,
        cardsTopRowRef,
        cardsFocusInProgressRef,
        hasScrollToHeaderTriggered,
        hasScrollToCardsTriggered,
        hasRestoreTriggered,
        hasSplitTriggered,
        headerIntroArmedRef,
        yearsScaleRef,
        setCardsFocused,
    });

    useEffect(() => {
        if (!cardsFocused) return;
   
        if (timelineInView) {
            setYearsScaleGate(true);
         
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    showYearsScale?.(false, { duration: 0.25, ease: 'power2.out' });
                });
            });
        }
    }, [cardsFocused, timelineInView, showYearsScale]);

  
    useEffect(() => {
        if (!cardsFocused) return;
        if (timelineInView) return;
      
        hideYearsScale?.(false, { duration: 0.2, ease: 'power2.out', y: 40 });

    }, [cardsFocused, timelineInView, hideYearsScale]);

    useCompanyHistoryWheelHandlers({
        sectionRef,
        cardsFocused,
        historyListRef,
        timelineWrapperRef,
        historyHeaderRef,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        backgroundRef,
        sliderRef,
        parentStartRef,
        onExitToParentTop,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        hasScrollToCardsTriggered,
        hasScrollToHeaderTriggered,
        hasSplitTriggered,
        hasRestoreTriggered,
        textAnimationReady,
        headerIntroInProgressRef,
        returnedToSliderRef,
        headerIntroArmedRef,
        showYearsScale,
        hideYearsScale,
        hideHistoryTag,
        exitCardsFocus,
        setCardsFocused,
        showAndPlaceHistoryTag,
        horizontalOffsetRef,
    });

    useEffect(() => {
        if (!cardsFocused) return;

        const onResize = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => showAndPlaceHistoryTag?.());
            });
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [cardsFocused, showAndPlaceHistoryTag]);

    const skipHorizontal = useCallback(
        (e) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();

            setYearsScaleGate(false);

            gsap.killTweensOf(window);
            gsap.killTweensOf(document.documentElement);
            gsap.killTweensOf(document.body);

            const container = timelineWrapperRef.current;
            if (container) {
                gsap.killTweensOf(container);
                gsap.set(container, { x: 0, clearProps: 'transform' });
            }
            horizontalOffsetRef.current = 0;

            hideYearsScale?.(true, { y: 40 });

            const root = sectionRef.current;
            if (!root) return;

            const next = root.nextElementSibling;

            let targetY;
            if (next) {
                const r = next.getBoundingClientRect();
                targetY = r.top + window.pageYOffset;
            } else {
                const r = root.getBoundingClientRect();
                targetY = r.bottom + window.pageYOffset;
            }

            const PAD = 20;
            gsap.to(window, {
                duration: 0.9,
                ease: 'power2.inOut',
                overwrite: 'auto',
                scrollTo: { y: Math.max(0, targetY - PAD), autoKill: false },
            });
        },
        [hideYearsScale]
    );

    const yearsScaleVisible = cardsFocused && yearsScaleGate && timelineInView && scaleYearsAsc.length > 0;

    return (
        <div
            id="history"
            ref={(node) => {
                viewRef(node);
                sectionRef.current = node;
            }}
            className={`${styles.history_section} ${cardsFocused ? styles.cards_focus : ''}`}
        >
            <div className={styles.history_content}>
                <CompanyHistoryHeader
                    historyHeaderRef={historyHeaderRef}
                    backgroundRef={backgroundRef}
                    titleRef={titleRef}
                    subtitleRef={subtitleRef}
                    marksGroupRef={marksGroupRef}
                    subtitleLineRef={subtitleLineRef}
                    subtitleLine1Ref={subtitleLine1Ref}
                    subtitleLine2Ref={subtitleLine2Ref}
                    cityVector={cityVector}
                />

                {loading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : visibleItems.length > 0 ? (
                    <div
                        ref={(node) => {
                            historyListRef.current = node;
                            timelineVisRef(node);
                        }}
                        className={styles.history_timeline_container}
                    >
                        <div ref={historyTagRef} className={styles.history_tag}>
                            История MARKS GROUP
                        </div>

                        <div ref={timelineWrapperRef} className={styles.timeline_wrapper}>
                            <div ref={cardsTopRowRef} className={styles.cards_row_top}>
                                {timelineItemsAdmin.map((year, idx) => {
                                    const isLast = idx === timelineItemsAdmin.length - 1;
                                    return (
                                        <div
                                            key={`top-${year}`}
                                            className={styles.year_cards_group}
                                            data-year={year}
                                            data-last-cards={isLast ? 'true' : 'false'}
                                        >
                                            {cardsByYear[year]?.top.map((item) => (
                                                <div key={item.id} className={styles.history_card_wrapper}>
                                                    <HistoryCard item={item} variant={item.img ? 1 : 2} />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.timeline}>
                                <div className={styles.timeline_line} />

                                <div className={styles.timeline_years}>
                                    {timelineItemsAdmin.map((year, idx) => {
                                        const isLast = idx === timelineItemsAdmin.length - 1;

                                        const hasBottomCards = (cardsByYear[year]?.bottom?.length || 0) > 0;
                                        const hasTopCards = (cardsByYear[year]?.top?.length || 0) > 0;

                                        let yearLabelClass = '';
                                        if (hasBottomCards) yearLabelClass = styles.year_label_bottom;
                                        else if (hasTopCards) yearLabelClass = styles.year_label_top;

                                        return (
                                            <div
                                                key={year}
                                                className={styles.timeline_year_marker}
                                                data-year={year}
                                                data-year-marker="true"
                                                data-last-year={isLast ? 'true' : 'false'}
                                            >
                                                <div className={styles.year_dot} />
                                                <div className={`${styles.year_label} ${yearLabelClass}`}>{year}</div>

                                                {hasTopCards && <div className={`${styles.year_connector} ${styles.connector_top}`} />}
                                                {hasBottomCards && (
                                                    <div className={`${styles.year_connector} ${styles.connector_bottom}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.cards_row_bottom}>
                                {timelineItemsAdmin.map((year, idx) => {
                                    const isLast = idx === timelineItemsAdmin.length - 1;
                                    return (
                                        <div
                                            key={`bottom-${year}`}
                                            className={styles.year_cards_group}
                                            data-year={year}
                                            data-last-cards={isLast ? 'true' : 'false'}
                                        >
                                            {cardsByYear[year]?.bottom.map((item) => (
                                                <div key={item.id} className={styles.history_card_wrapper}>
                                                    <HistoryCard item={item} variant={item.img ? 1 : 2} isBottom />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.empty_history}>История компании обновляется</div>
                )}
            </div>

            <HistoryYearsScale
                ref={yearsScaleRef}
                years={scaleYearsAsc}
                timelineWrapperRef={timelineWrapperRef}
                horizontalOffsetRef={horizontalOffsetRef}
                visible={yearsScaleVisible}
                onSkip={skipHorizontal}
            />
        </div>
    );
}
