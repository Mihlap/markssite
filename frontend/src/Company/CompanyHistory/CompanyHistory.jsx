import { useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Modal from 'react-modal';

import HistoryCard from './HistoryCard';
import CompanyHistoryHeader from './CompanyHistoryHeader';
import HistoryYearsScale from './HistoryYearsScale';
import HistoryModalBlocks from './HistoryModalBlocks';

import { useCompanyHistoryHeaderIntro } from '../utils/useCompanyHistoryHeaderIntro';
import { useCompanyHistoryWheelHandlers } from '../utils/historyWheel/useCompanyHistoryWheelHandlers';
import { useCompanyHistoryAnimations } from '../utils/useCompanyHistoryAnimations';

import { fetchCompanyHistory } from '../../store/Slice/companyHistorySlice';
import styles from './CompanyHistory.module.scss';
import headerStyles from './CompanyHistoryHeader.module.scss';
import cityVector from '../icons/cityVector.svg';
import { normalizeConstructorGroups } from '../utils/historyModalUtils';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    const [viewRef, inView] = useInView({ threshold: 0.2, triggerOnce: true });
    const [timelineVisRef, timelineInView] = useInView({
        threshold: 0.15,
        triggerOnce: false,
    });
    const [sectionVisibilityRef, sectionInView] = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });
    const prevSectionInViewRef = useRef(false);
    const hashNavigationRef = useRef(false);

    useEffect(() => {       
        const handleHashChange = () => {
            if (window.location.hash === '#history' || window.location.hash === '#section1') {
                hashNavigationRef.current = true;           
                setTimeout(() => {
                    hashNavigationRef.current = false;
                }, 100);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
      
        if (window.location.hash === '#history' || window.location.hash === '#section1') {
            hashNavigationRef.current = true;
            setTimeout(() => {
                hashNavigationRef.current = false;
            }, 100);
        }

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.__HISTORY_GSAP_PATCHED__) return;
        window.__HISTORY_GSAP_PATCHED__ = true;

        const origTo = gsap.to;

        gsap.to = function patchedTo(targets, vars, position) {
            const isWin =
                targets === window ||
                (Array.isArray(targets) && targets.length === 1 && targets[0] === window);

            const hasScrollTo = !!(vars && typeof vars === 'object' && vars.scrollTo);

            if (isWin && hasScrollTo) {
                const y = typeof vars.scrollTo === 'object' ? vars.scrollTo.y : vars.scrollTo;
                const tag = (vars && vars.data && vars.data.tag) ? vars.data.tag : 'NO_TAG';
            }

            return origTo.call(this, targets, vars, position);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onWheel = (e) => {
            if (Math.abs(e.deltaY) < 1 && Math.abs(e.deltaX) < 1) return;

            const root = sectionRef.current;
            const r = root?.getBoundingClientRect?.();
            const inArea = r ? r.bottom > 0 && r.top < window.innerHeight : null;
        };

        window.addEventListener('wheel', onWheel, { passive: true });
        return () => window.removeEventListener('wheel', onWheel);
    }, [cardsFocused]);

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

            const padRight = Math.round(window.innerWidth * 0.9);
            el.style.setProperty('--history-pad-right', `${padRight}px`);
            el.style.setProperty('--history-pad-right-num', `${padRight}`);
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
        exitCardsFocusSilent,
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
        isModalOpen,
    });

    useEffect(() => {
        if (!cardsFocused) {
            hideHistoryTag?.(true);
        }
    }, [cardsFocused, hideHistoryTag]);

    useEffect(() => {
        if (isModalOpen) {
            hideHistoryTag?.(true);
        } else if (cardsFocused && sectionInView) {
            showAndPlaceHistoryTag?.();
        } else if (!sectionInView) {
            hideHistoryTag?.(false);
        }
    }, [isModalOpen, cardsFocused, sectionInView, hideHistoryTag, showAndPlaceHistoryTag]);

    useEffect(() => {
        const wasNotVisible = !prevSectionInViewRef.current;
        const isNowVisible = sectionInView;
        const becameVisible = wasNotVisible && isNowVisible;
   
        const title = titleRef.current;
        const marksGroup = marksGroupRef.current;
        const hasActiveAnimation = title?.classList.contains(headerStyles.animate) || 
                                   marksGroup?.classList.contains(headerStyles.animate);
      
        const container = timelineWrapperRef.current;
        const hasHorizontalScroll = container && Math.abs(horizontalOffsetRef.current) > 0;
        const needsReset = cardsFocused || hasHorizontalScroll || 
                          (becameVisible && hasActiveAnimation) ||
                          (hashNavigationRef.current && sectionInView && hasActiveAnimation);

        if (needsReset && (becameVisible || (hashNavigationRef.current && sectionInView))) {
           
            hideYearsScale?.(true, { y: 40 });
           
            if (container) {
                gsap.killTweensOf(container);
                gsap.set(container, { x: 0, clearProps: 'transform' });
            }
            horizontalOffsetRef.current = 0;
         
            if (cardsFocused && historyListRef.current) {
                exitCardsFocusSilent?.(historyListRef.current);
            }
          
            const subtitleLine = subtitleLineRef.current;
            const descLine1 = subtitleLine1Ref.current;
            const descLine2 = subtitleLine2Ref.current;

            if (title || marksGroup || subtitleLine || descLine1 || descLine2) {          
                [title, marksGroup, subtitleLine, descLine1, descLine2].forEach((el) => {
                    if (!el) return;
                    gsap.killTweensOf(el);
                    el.classList.remove(headerStyles.animate);
                    el.style.animation = '';
                    el.style.opacity = '';
                    el.style.transform = '';
                });

                if (title) {
                    title.style.opacity = '0';
                    title.style.transform = 'translateX(100vw)';
                }
                if (marksGroup) {
                    marksGroup.style.opacity = '0';
                    marksGroup.style.transform = 'translateX(-100vw)';
                }
                if (subtitleLine) {
                    subtitleLine.style.opacity = '0';
                    subtitleLine.style.transform = 'translateX(100vw)';
                }
                if (descLine1) {
                    descLine1.style.opacity = '0';
                    descLine1.style.transform = 'translateX(100vw)';
                }
                if (descLine2) {
                    descLine2.style.opacity = '0';
                    descLine2.style.transform = 'translateX(100vw)';
                }
            }
         
            hasScrollToCardsTriggered.current = false;
            hasScrollToHeaderTriggered.current = false;
            hasRestoreTriggered.current = false;
            headerIntroArmedRef.current = true;
            headerIntroInProgressRef.current = false;
            returnedToSliderRef.current = false;
            cardsIntroTriggeredRef.current = false;
     
            requestAnimationFrame(() => {
                const headerEl = historyHeaderRef.current;
                if (headerEl) {
                    const headerRect = headerEl.getBoundingClientRect();
                    const targetY = Math.max(0, headerRect.top + window.pageYOffset);
                    
                    gsap.killTweensOf(window);
                    gsap.to(window, {
                        duration: 0.6,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        scrollTo: { y: targetY, autoKill: false },
                        data: { tag: 'RESET_TO_HEADER' },
                        onComplete: () => {                       
                            requestAnimationFrame(() => {
                                if (title) title.classList.add(headerStyles.animate);
                                if (marksGroup) marksGroup.classList.add(headerStyles.animate);
                                if (subtitleLine) subtitleLine.classList.add(headerStyles.animate);
                                if (descLine1) descLine1.classList.add(headerStyles.animate);
                                if (descLine2) descLine2.classList.add(headerStyles.animate);
                            });
                        },
                    });
                }
            });
        }
     
        prevSectionInViewRef.current = sectionInView;
    }, [sectionInView, cardsFocused, historyHeaderRef, historyListRef, timelineWrapperRef, exitCardsFocusSilent, horizontalOffsetRef, hideYearsScale, titleRef, marksGroupRef, subtitleLineRef, subtitleLine1Ref, subtitleLine2Ref]);

    const skipHorizontal = useCallback(
        (e) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();

            const ae = document.activeElement;
            if (ae && typeof ae.blur === 'function') ae.blur();

            setYearsScaleGate(false);

            exitToParentInProgressRef.current = true;

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

            const cardsEl = historyListRef.current;
            if (cardsEl && cardsFocused) {
                exitCardsFocusSilent?.(cardsEl);
            }

            const root = sectionRef.current;
            if (!root) {
                exitToParentInProgressRef.current = false;
                return;
            }

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
            const finalY = Math.max(0, targetY - PAD);

            if (typeof window !== 'undefined') {
                window.__HISTORY_SKIP_LOCK_UNTIL__ = Date.now() + 500;
            }

            gsap.to(window, {
                duration: 0.9,
                ease: 'power2.inOut',
                overwrite: 'auto',
                scrollTo: { y: finalY, autoKill: false },
                data: { tag: 'SKIP_SCROLL' },
                onComplete: () => {
                    exitToParentInProgressRef.current = false;
                    if (typeof window !== 'undefined') {
                        window.__HISTORY_SKIP_LOCK_UNTIL__ = 0;
                    }
                },
            });
        },
        [
            hideYearsScale,
            cardsFocused,
            timelineInView,
            exitCardsFocusSilent,
        ]
    );

    const yearsScaleVisible = cardsFocused && yearsScaleGate && timelineInView && scaleYearsAsc.length > 0;

    const padRightNum =
        typeof window !== 'undefined'
            ? Math.round(window.innerWidth * 0.9)
            : 0;

    const handleOpenChronicle = useCallback((item) => {
        let rawGroups = [];
        if (Array.isArray(item?.dynamicBlocks) && item.dynamicBlocks.length) {
            rawGroups = item.dynamicBlocks;
        } else if (Array.isArray(item?.ConstructorLegends) && item.ConstructorLegends.length) {
            rawGroups = item.ConstructorLegends.map((c) => (Array.isArray(c?.data) ? c.data : [])).filter((g) => g.length);
        }

        if (Array.isArray(rawGroups) && rawGroups.length && !Array.isArray(rawGroups[0])) {
            rawGroups = [rawGroups];
        }

        const normalizedBlocks = normalizeConstructorGroups(rawGroups);

        setSelectedHistoryItem({
            ...item,
            dynamicBlocks: normalizedBlocks,
        });
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedHistoryItem(null);
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
    }, []);

    return (
        <div
            id="history"
            ref={(node) => {
                viewRef(node);
                sectionVisibilityRef(node);
                sectionRef.current = node;
            }}
            className={`${styles.history_section} ${cardsFocused ? styles.cards_focus : ''}`}
        >
            <div ref={historyTagRef} className={styles.history_tag}>
                История MARKS GROUP
            </div>

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
                        <div
                            ref={timelineWrapperRef}
                            className={styles.timeline_wrapper}
                            data-pad-right={padRightNum}
                        >
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
                                                    <HistoryCard item={{ ...item, onOpenChronicle: handleOpenChronicle }} variant={item.img ? 1 : 2} />
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
                                                <div className={styles.year_dot} data-year-dot="true" />
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
                                                    <HistoryCard item={{ ...item, onOpenChronicle: handleOpenChronicle }} variant={item.img ? 1 : 2} isBottom />
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
                visible={yearsScaleVisible && !isModalOpen}
                onSkip={skipHorizontal}
                isModalOpen={isModalOpen}
            />

            {isModalOpen && selectedHistoryItem && (
                <Modal
                    className={styles.modal_wrapper}
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    onAfterOpen={() => {
                        document.body.style.overflow = 'hidden';
                        document.body.classList.add('modal-open');
                    }}
                    onAfterClose={() => {
                        document.body.style.overflow = '';
                        document.body.classList.remove('modal-open');
                    }}
                    ariaHideApp={false}
                    style={{
                        overlay: { zIndex: 10, backgroundColor: '#2C3B447A' },
                        content: { zIndex: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' },
                    }}>
                    <div key={selectedHistoryItem.id} className={styles.modal_context}>
                        <div
                            className={`${styles.modal_close} ${styles.fixed}`}
                            onClick={handleCloseModal}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
                                    fill="black"
                                />
                            </svg>
                        </div>

                        {(selectedHistoryItem.year || selectedHistoryItem.title) && (
                            <div className={styles.modal_title}>
                                {selectedHistoryItem.year}
                                {selectedHistoryItem.year && selectedHistoryItem.title && ' — '}
                                {selectedHistoryItem.title}
                            </div>
                        )}

                        <HistoryModalBlocks selectedCard={selectedHistoryItem} bucketUrl={process.env.REACT_APP_S3_BUCKET_URL} />
                    </div>
                </Modal>
            )}
        </div>
    );
}
