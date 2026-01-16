import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function CompanyHistory({ parentStartRef, sliderRef, externalHistoryHeaderRef }) {
    const dispatch = useDispatch();
    const historyItems = useSelector((state) => state.companyHistory.items || []);
    const loading = useSelector((state) => state.companyHistory.loading);

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
        const uniqueYears = [...new Set(visibleItems.map((item) => item.year))].sort((a, b) => a - b);

        const grouped = {};
        uniqueYears.forEach((year) => {
            grouped[year] = {
                top: [],
                bottom: [],
            };
        });

        visibleItems.forEach((item, index) => {
            const year = item.year;
            if (!grouped[year]) return;
            if (index % 2 === 0) grouped[year].top.push(item);
            else grouped[year].bottom.push(item);
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
        <div id="history" ref={ref} className={`${styles.history_section} ${cardsFocused ? styles.cards_focus : ''}`}>
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
                                {timelineItems.map((year) => (
                                    <div key={`top-${year}`} className={styles.year_cards_group} data-year={year}>
                                        {cardsByYear[year]?.top.map((item) => (
                                            <div key={item.id} className={styles.history_card_wrapper}>
                                                <HistoryCard item={item} variant={item.img ? 1 : 2} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.timeline}>
                                <div className={styles.timeline_line}></div>
                                <div className={styles.timeline_years}>
                                    {timelineItems.map((year) => (
                                        <div key={year} className={styles.timeline_year_marker} data-year={year}>
                                            <div className={styles.year_dot}></div>
                                            <div className={styles.year_label}>{year}</div>
                                            {cardsByYear[year]?.top.length > 0 && (
                                                <div className={`${styles.year_connector} ${styles.connector_top}`}></div>
                                            )}
                                            {cardsByYear[year]?.bottom.length > 0 && (
                                                <div className={`${styles.year_connector} ${styles.connector_bottom}`}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.cards_row_bottom}>
                                {timelineItems.map((year) => (
                                    <div key={`bottom-${year}`} className={styles.year_cards_group} data-year={year}>
                                        {cardsByYear[year]?.bottom.map((item) => (
                                            <div key={item.id} className={styles.history_card_wrapper}>
                                                <HistoryCard item={item} variant={item.img ? 1 : 2} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
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


