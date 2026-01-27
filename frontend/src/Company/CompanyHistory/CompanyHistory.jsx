import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import styles from './CompanyHistory.module.scss';
import { fetchCompanyHistory } from '../../store/Slice/companyHistorySlice';
import cityVector from '../icons/cityVector.svg';
import HistoryCard from './HistoryCard';
import CompanyHistoryHeader from './CompanyHistoryHeader';
import { useCompanyHistoryHeaderIntro } from '../utils/useCompanyHistoryHeaderIntro';
import { useCompanyHistoryWheelHandlers } from '../utils/useCompanyHistoryWheelHandlers';
import { useCompanyHistoryAnimations } from '../utils/useCompanyHistoryAnimations';

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

    const [animationReady, setAnimationReady] = useState(false);
    const [cardsFocused, setCardsFocused] = useState(false);

    const cardsFocusInProgressRef = useRef(false);
    const exitToParentInProgressRef = useRef(false);

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    // Сброс состояний при размонтировании для корректной работы при повторном переходе
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

    const visibleItems = useMemo(
        () =>
            [...historyItems]
                .filter((item) => !item.hidden)
                .sort((a, b) => {
                    const ao = a.order ?? 0;
                    const bo = b.order ?? 0;
                    if (ao !== bo) return ao - bo;
                    return (b.year ?? 0) - (a.year ?? 0);
                }),
        [historyItems]
    );

    const { timelineItems, cardsByYear } = useMemo(() => {
        const uniqueYears = [];
        const seenYears = new Set();
        for (const item of visibleItems) {
            if (!seenYears.has(item.year)) {
                seenYears.add(item.year);
                uniqueYears.push(item.year);
            }
        }

        const grouped = {};
        uniqueYears.forEach((year) => {
            grouped[year] = { top: [], bottom: [] };
        });

        const itemsByYear = {};
        visibleItems.forEach((item) => {
            const year = item.year;
            if (!itemsByYear[year]) itemsByYear[year] = [];
            itemsByYear[year].push(item);
        });

        let globalIndex = 0;
        uniqueYears.forEach((year) => {
            const yearItems = itemsByYear[year] || [];
            yearItems.forEach((item) => {
                if (globalIndex % 2 === 0) grouped[year].top.push(item);
                else grouped[year].bottom.push(item);
                globalIndex++;
            });
        });

        return { timelineItems: uniqueYears, cardsByYear: grouped };
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

    const { exitCardsFocus } = useCompanyHistoryAnimations({
        animationReady,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        backgroundRef,
        cardsFocusInProgressRef,
        hasScrollToHeaderTriggered,
        hasScrollToCardsTriggered,
        hasRestoreTriggered,
        hasSplitTriggered,
        headerIntroArmedRef,
        setCardsFocused,
    });

    useCompanyHistoryWheelHandlers({
        sectionRef,
        inView,
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
        exitCardsFocus,
        setCardsFocused,
    });

    return (
        <div
            id="history"
            ref={(node) => {
                ref(node);
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
                    <div ref={historyListRef} className={styles.history_timeline_container}>
                        <div ref={historyTagRef} className={styles.history_tag}>
                            История MARKS GROUP
                        </div>

                        <div ref={timelineWrapperRef} className={styles.timeline_wrapper}>
                            <div className={styles.cards_row_top}>
                                {timelineItems.map((year, idx) => {
                                    const isLast = idx === timelineItems.length - 1;
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
                                <div className={styles.timeline_line}></div>

                                <div className={styles.timeline_years}>
                                    {timelineItems.map((year, idx) => {
                                        const isLast = idx === timelineItems.length - 1;

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
                                                data-last-year={isLast ? 'true' : 'false'}
                                            >
                                                <div className={styles.year_dot}></div>
                                                <div className={`${styles.year_label} ${yearLabelClass}`}>{year}</div>

                                                {hasTopCards && (
                                                    <div className={`${styles.year_connector} ${styles.connector_top}`}></div>
                                                )}
                                                {hasBottomCards && (
                                                    <div className={`${styles.year_connector} ${styles.connector_bottom}`}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.cards_row_bottom}>
                                {timelineItems.map((year, idx) => {
                                    const isLast = idx === timelineItems.length - 1;
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
        </div>
    );
}
