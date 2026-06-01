import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import CompanyHistoryHeader from './CompanyHistoryHeader';
import HistoryYearsScale from './HistoryYearsScale';
import HistoryTimelineDesktop from './HistoryTimelineDesktop';
import HistoryTimelineMobile from './HistoryTimelineMobile';
import HistoryModal from './HistoryModal';
import { useCompanyHistoryBreakpoints } from './hooks/useCompanyHistoryBreakpoints';
import { useCompanyHistoryModel } from './hooks/useCompanyHistoryModel';
import { useHistoryLayoutVars } from './hooks/useHistoryLayoutVars';
import { useHistoryHashNavigationFlag } from './hooks/useHistoryHashNavigationFlag';
import { useHistoryMobileScrollLock } from './hooks/useHistoryMobileScrollLock';
import { useCompanyHistoryMobileGestures } from './hooks/useCompanyHistoryMobileGestures';

import { useCompanyHistoryHeaderIntro } from '../utils/useCompanyHistoryHeaderIntro';
import { useCompanyHistoryWheelHandlers } from '../utils/historyWheel/useCompanyHistoryWheelHandlers';
import { useCompanyHistoryAnimations } from '../utils/useCompanyHistoryAnimations';

import { fetchCompanyHistory } from '../../store/Slice/companyHistorySlice';
import layoutStyles from './CompanyHistory.module.scss';
import timelineStyles from './HistoryTimeline.module.scss';
import headerStyles from './CompanyHistoryHeader.module.scss';
import cityVector from '../icons/cityVector.svg';
import { normalizeConstructorGroups } from '../utils/historyModalUtils';
import { preloadHistoryPreviews } from '../utils/historyCardImageSrc';

gsap.registerPlugin(ScrollToPlugin);
const HISTORY_HASHES = ['#history', '#section1'];

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
    const mobileReturnToHistoryArmedRef = useRef(false);

    const cardsFocusInProgressRef = useRef(false);
    const exitToParentInProgressRef = useRef(false);

    const cardsTopRowRef = useRef(null);
    const yearsScaleRef = useRef(null);
    const mobileTimelineYearsRef = useRef(null);

    const horizontalOffsetRef = useRef(0);
    const { lockMobileScroll, unlockMobileScroll } = useHistoryMobileScrollLock();

    const [animationReady, setAnimationReady] = useState(false);
    const [cardsFocused, setCardsFocused] = useState(false);
    const [yearsScaleGate, setYearsScaleGate] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    const { isDesktop, isTablet, mobileSlidesOffsetAfter } = useCompanyHistoryBreakpoints();

    const [mobileActiveYearIndex, setMobileActiveYearIndex] = useState(0);
    const [mobileIncomingYearIndex, setMobileIncomingYearIndex] = useState(null);
    const [isMobileSliding, setIsMobileSliding] = useState(false);
    // mobileSlidesOffsetAfter — из useCompanyHistoryBreakpoints

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
    const hashNavigationRef = useHistoryHashNavigationFlag(HISTORY_HASHES);

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
            unlockMobileScroll();

            if (sectionRef.current) sectionRef.current.removeAttribute('data-focus-layout');
        };
    }, []);

    useHistoryLayoutVars(sectionRef);

    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;
        if (!cardsFocused) root.removeAttribute('data-focus-layout');
    }, [cardsFocused]);

    const { visibleItems, timelineItemsAdmin, cardsByYear, scaleYearsAsc, yearIndexByYear } =
        useCompanyHistoryModel(historyItems);

    useEffect(() => {
        if (isDesktop) return;
        if (!visibleItems.length || !timelineItemsAdmin.length) return;

        const firstWithYear = visibleItems.find((item) => item.year != null);
        if (!firstWithYear) return;

        const idx = yearIndexByYear[String(firstWithYear.year)];
        if (typeof idx === 'number' && !Number.isNaN(idx)) {
            setMobileActiveYearIndex(idx);
            setMobileIncomingYearIndex(null);
            setIsMobileSliding(false);
        }
    }, [isDesktop, visibleItems, timelineItemsAdmin, yearIndexByYear]);

    useEffect(() => {
        dispatch(fetchCompanyHistory());
    }, [dispatch]);

    useEffect(() => {
        if (loading || !visibleItems.length) return undefined;
        preloadHistoryPreviews(visibleItems, 10);
        return undefined;
    }, [loading, visibleItems]);

    useEffect(() => {
        if (loading || !visibleItems.length || !isDesktop) return undefined;

        const revealCards = () => {
            const wrappers = historyListRef.current?.querySelectorAll('[class*="history_card_wrapper"]');
            if (!wrappers?.length) return;

            wrappers.forEach((el) => {
                if (!el.classList.contains(timelineStyles.animate)) {
                    el.classList.add(timelineStyles.animate);
                }
            });
        };

        requestAnimationFrame(revealCards);
        const timer = setTimeout(revealCards, 120);

        return () => clearTimeout(timer);
    }, [loading, visibleItems.length, isDesktop]);

    useCompanyHistoryHeaderIntro({
        isDesktop,
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
        cardsFocused,
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
        isDesktop,
        isTablet,
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

        const needsReset =
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
                unlockMobileScroll();
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
                    unlockMobileScroll();
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
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedHistoryItem(null);
    }, []);

    useCompanyHistoryMobileGestures({
        isDesktop,
        isModalOpen,
        cardsFocused,
        setCardsFocused,
        sectionRef,
        historyHeaderRef,
        historyListRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        cardsFocusInProgressRef,
        mobileReturnToHistoryArmedRef,
        lockMobileScroll,
        headerAnimateClass: headerStyles.animate,
        onExitToParentTop,
    });

    const hasHistory = !loading && visibleItems.length > 0;

    return (
        <div
            id="history"
            ref={(node) => {
                viewRef(node);
                sectionVisibilityRef(node);
                sectionRef.current = node;
            }}
            className={`${layoutStyles.history_section} ${!hasHistory ? layoutStyles.history_section_empty : ''
                } ${cardsFocused ? timelineStyles.cards_focus : ''}`}
        >
            {isDesktop && (
                <div ref={historyTagRef} className={timelineStyles.history_tag}>
                    История MARKS GROUP
                </div>
            )}

            <div className={layoutStyles.history_content}>
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
                    <div className={layoutStyles.loading}>Загрузка...</div>
                ) : hasHistory ? (
                    <div
                        ref={(node) => {
                            historyListRef.current = node;
                            timelineVisRef(node);
                        }}
                        className={timelineStyles.history_timeline_container}
                    >
                        {isDesktop ? (
                            <HistoryTimelineDesktop
                                timelineItemsAdmin={timelineItemsAdmin}
                                cardsByYear={cardsByYear}
                                isTablet={isTablet}
                                handleOpenChronicle={handleOpenChronicle}
                                timelineWrapperRef={timelineWrapperRef}
                                cardsTopRowRef={cardsTopRowRef}
                                padRightNum={padRightNum}
                            />
                        ) : (
                            <HistoryTimelineMobile
                                visibleItems={visibleItems}
                                timelineItemsAdmin={timelineItemsAdmin}
                                cardsByYear={cardsByYear}
                                mobileSlidesOffsetAfter={mobileSlidesOffsetAfter}
                                mobileTimelineYearsRef={mobileTimelineYearsRef}
                                mobileActiveYearIndex={mobileActiveYearIndex}
                                mobileIncomingYearIndex={mobileIncomingYearIndex}
                                isMobileSliding={isMobileSliding}
                                cardsFocused={cardsFocused}
                                setMobileActiveYearIndex={setMobileActiveYearIndex}
                                setMobileIncomingYearIndex={setMobileIncomingYearIndex}
                                setIsMobileSliding={setIsMobileSliding}
                                yearIndexByYear={yearIndexByYear}
                                isDesktop={isDesktop}
                                handleOpenChronicle={handleOpenChronicle}
                                onSkip={skipHorizontal}
                                onUnlockScroll={unlockMobileScroll}
                            />
                        )}
                    </div>
                ) : (
                    <div className={layoutStyles.empty_history}>История компании обновляется</div>
                )}
            </div>

            {isDesktop && (
                <HistoryYearsScale
                    ref={yearsScaleRef}
                    years={scaleYearsAsc}
                    timelineWrapperRef={timelineWrapperRef}
                    horizontalOffsetRef={horizontalOffsetRef}
                    visible={yearsScaleVisible && !isModalOpen}
                    onSkip={skipHorizontal}
                    isModalOpen={isModalOpen}
                />
            )}

            <HistoryModal
                isOpen={isModalOpen}
                selectedHistoryItem={selectedHistoryItem}
                onClose={handleCloseModal}
            />
        </div>
    );
}
