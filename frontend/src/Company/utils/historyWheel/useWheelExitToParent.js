import { useEffect } from 'react';
import gsap from 'gsap';
import headerStyles from '../../CompanyHistory/CompanyHistoryHeader.module.scss';
import { isHistoryActive, isEventInsideModal, stopWheelHard, clearFocusPhase } from './wheelShared';

export function useWheelExitToParent({
    sectionRef,
    cardsFocused,
    historyListRef,
    historyHeaderRef,
    historyTagRef,
    marksGroupRef,
    titleRef,
    subtitleLineRef,
    subtitleLine1Ref,
    subtitleLine2Ref,
    sliderRef,
    parentStartRef,
    onExitToParentTop,
    cardsFocusInProgressRef,
    exitToParentInProgressRef,
    headerIntroInProgressRef,
    textAnimationReady,
    hasSplitTriggered,
    hasRestoreTriggered,
    hasScrollToHeaderTriggered,
    returnedToSliderRef,
    headerIntroArmedRef,
    isDesktop,
}) {
    useEffect(() => {
        const handleWheelExitUp = (e) => {
            if (isEventInsideModal(e)) return;
            if (!isHistoryActive(sectionRef, e)) return;
            if (e.deltaY >= 0) return;

            const lockUntil =
                typeof window !== 'undefined' ? (window.__HISTORY_SKIP_LOCK_UNTIL__ || 0) : 0;
            if (Date.now() < lockUntil) {
                stopWheelHard(e);
                return;
            }

            if (cardsFocused || cardsFocusInProgressRef.current) return;

            if (exitToParentInProgressRef.current) {
                stopWheelHard(e);
                return;
            }

            const PAD = 20;

            const cardsEl = historyListRef?.current;
            const headerEl = historyHeaderRef?.current;

            if (cardsEl) {
                const cardsTopAbs = cardsEl.getBoundingClientRect().top + window.pageYOffset;
                const targetCardsY = Math.max(0, cardsTopAbs - PAD);

                if (window.pageYOffset > targetCardsY + 4) {
                    stopWheelHard(e);

                    gsap.killTweensOf(window);
                    exitToParentInProgressRef.current = true;

                    gsap.to(window, {
                        duration: 0.65,
                        ease: 'power2.inOut',
                        overwrite: 'auto',
                        scrollTo: { y: targetCardsY, autoKill: false },
                        data: { tag: 'UP_TO_CARDS' },
                        onComplete: () => {
                            exitToParentInProgressRef.current = false;
                        },
                    });

                    return;
                }
            }

            if (headerEl) {
                const headerTopAbs = headerEl.getBoundingClientRect().top + window.pageYOffset;
                const targetHeaderY = Math.max(0, headerTopAbs - PAD);

                if (window.pageYOffset > targetHeaderY + 4 && Math.abs(window.pageYOffset - headerTopAbs) > PAD + 10) {
                    stopWheelHard(e);

                    gsap.killTweensOf(window);
                    exitToParentInProgressRef.current = true;

                    returnedToSliderRef.current = false;

                    hasRestoreTriggered.current = true;
                    hasSplitTriggered.current = false;
                    hasScrollToHeaderTriggered.current = true;
                    if (headerIntroArmedRef) headerIntroArmedRef.current = true;
                    headerIntroInProgressRef.current = false;

                    const marksGroup = marksGroupRef.current;
                    const title = titleRef.current;
                    const subtitleLine = subtitleLineRef.current;
                    const descLine1 = subtitleLine1Ref.current;
                    const descLine2 = subtitleLine2Ref.current;

                    if (marksGroup && title) {
                        const elements = [marksGroup, title, subtitleLine, descLine1, descLine2].filter(Boolean);
                        elements.forEach((el) => {
                            if (!el) return;
                            gsap.killTweensOf(el);
                            gsap.set(el, { clearProps: 'all' });
                            el.classList.remove(headerStyles.animate);
                            el.style.animation = '';
                            el.style.opacity = '';
                            el.style.transform = '';
                        });
                    }

                    gsap.to(window, {
                        duration: 0.65,
                        ease: 'power2.inOut',
                        overwrite: 'auto',
                        scrollTo: { y: targetHeaderY, autoKill: false },
                        data: { tag: 'UP_TO_HEADER' },
                        onComplete: () => {
                            exitToParentInProgressRef.current = false;
                            hasScrollToHeaderTriggered.current = false;
                            if (headerIntroArmedRef) headerIntroArmedRef.current = true;
                            headerIntroInProgressRef.current = false;
                            textAnimationReady.current = true;

                            requestAnimationFrame(() => {
                                const marksGroupEl = marksGroupRef?.current;
                                const titleEl = titleRef?.current;
                                const subtitleLineEl = subtitleLineRef?.current;
                                const descLine1El = subtitleLine1Ref?.current;
                                const descLine2El = subtitleLine2Ref?.current;

                                if (marksGroupEl && titleEl && descLine1El) {
                                    const elements = [titleEl, marksGroupEl, subtitleLineEl, descLine1El, descLine2El].filter(Boolean);

                                    elements.forEach((el) => {
                                        if (!el) return;
                                        gsap.killTweensOf(el);
                                        gsap.set(el, { clearProps: 'transform,opacity' });
                                        el.classList.remove(headerStyles.animate);
                                        el.style.animation = '';
                                        el.style.opacity = '';
                                        el.style.transform = '';
                                    });

                                    void titleEl.offsetWidth;

                                    requestAnimationFrame(() => {
                                        if (titleEl) titleEl.classList.add(headerStyles.animate);
                                        if (marksGroupEl) marksGroupEl.classList.add(headerStyles.animate);
                                        if (subtitleLineEl) subtitleLineEl.classList.add(headerStyles.animate);
                                        if (descLine1El) descLine1El.classList.add(headerStyles.animate);
                                        if (descLine2El) descLine2El.classList.add(headerStyles.animate);

                                        hasRestoreTriggered.current = false;
                                    });
                                }
                            });
                        },
                    });

                    return;
                }
            } else {
                stopWheelHard(e);
                return;
            }
            const isIntroActive = headerIntroInProgressRef.current || !textAnimationReady.current;

            if (isIntroActive) {
                headerIntroInProgressRef.current = false;
                textAnimationReady.current = true;
            }

            stopWheelHard(e);

            gsap.killTweensOf(window);
            exitToParentInProgressRef.current = true;

            clearFocusPhase(sectionRef);

            hasSplitTriggered.current = true;
            hasRestoreTriggered.current = false;

            if (historyTagRef.current) {
                // Скрываем таб без применения transform, только opacity
                const tag = historyTagRef.current;
                tag.style.opacity = '0';
                tag.style.visibility = 'hidden';
            }

            const marksGroup = marksGroupRef.current;
            const title = titleRef.current;
            const subtitleLine = subtitleLineRef.current;
            const descLine1 = subtitleLine1Ref.current;
            const descLine2 = subtitleLine2Ref.current;

            if (!marksGroup || !title) {
                exitToParentInProgressRef.current = false;
                hasSplitTriggered.current = false;
                return;
            }

            const elements = [marksGroup, title, subtitleLine, descLine1, descLine2];
            elements.forEach((el) => {
                if (!el) return;
                gsap.killTweensOf(el);

                const computedStyle = window.getComputedStyle(el);
                const currentX = gsap.getProperty(el, 'x') || 0;
                const currentOpacity = parseFloat(computedStyle.opacity) || 1;

                gsap.set(el, { x: currentX, opacity: currentOpacity, clearProps: '' });
                el.classList.remove(headerStyles.animate);
                el.style.animation = 'none';
                el.style.animationPlayState = 'paused';
                el.style.transition = 'none';
            });

            const sliderEl = sliderRef?.current;
            const parentEl = parentStartRef?.current;

            let y = 0;
            if (sliderEl) {
                const sliderRect = sliderEl.getBoundingClientRect();
                const sliderAbsoluteBottom = sliderRect.bottom + window.pageYOffset;
                const bottomOffset = 60;
                const NAV_OFFSET_MOBILE = 120;
                const extraOffset = isDesktop ? 0 : NAV_OFFSET_MOBILE;
                y = Math.max(0, sliderAbsoluteBottom - window.innerHeight + bottomOffset + extraOffset);
            } else if (parentEl) {
                const r = parentEl.getBoundingClientRect();
                const NAV_OFFSET_MOBILE = 120;
                const baseY = r.top + window.pageYOffset;
                y = isDesktop
                    ? Math.max(0, baseY)
                    : Math.max(0, baseY - NAV_OFFSET_MOBILE);
            }

            const scrollDuration = isIntroActive ? 0.7 : 0.85;

            requestAnimationFrame(() => {
                gsap.to(window, {
                    duration: scrollDuration,
                    ease: 'power2.inOut',
                    overwrite: 'auto',
                    scrollTo: { y, autoKill: false },
                    onComplete: () => {
                        if (typeof onExitToParentTop === 'function') onExitToParentTop();
                    },
                });
            });

            const textAnimationDuration = 0.6;
            const exitXForMarks = '-100vw';
            const exitXForOthers = isDesktop ? '100vw' : '-100vw';
            const tl = gsap.timeline({
                defaults: { ease: 'power2.in', force3D: true, overwrite: 'auto' },
                onComplete: () => {
                    hasSplitTriggered.current = false;
                    if (headerIntroArmedRef) headerIntroArmedRef.current = true;
                    hasScrollToHeaderTriggered.current = false;
                    exitToParentInProgressRef.current = false;
                    textAnimationReady.current = false;
                    returnedToSliderRef.current = true;
                },
            });

            tl.fromTo(
                marksGroup,
                {
                    x: gsap.getProperty(marksGroup, 'x') || 0,
                    opacity: gsap.getProperty(marksGroup, 'opacity') || 1,
                },
                { x: exitXForMarks, opacity: 0, duration: textAnimationDuration, immediateRender: true },
                0
            );

            [title, subtitleLine, descLine1, descLine2]
                .filter(Boolean)
                .forEach((el) => {
                    tl.fromTo(
                        el,
                        { x: gsap.getProperty(el, 'x') || 0, opacity: gsap.getProperty(el, 'opacity') || 1 },
                        { x: exitXForOthers, opacity: 0, duration: textAnimationDuration, immediateRender: true },
                        0
                    );
                });
        };

        window.addEventListener('wheel', handleWheelExitUp, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelExitUp);
    }, [
        sectionRef,
        cardsFocused,
        historyListRef,
        historyHeaderRef,
        sliderRef,
        parentStartRef,
        onExitToParentTop,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        headerIntroInProgressRef,
        textAnimationReady,
        returnedToSliderRef,
        headerIntroArmedRef,
        hasSplitTriggered,
        hasRestoreTriggered,
        hasScrollToHeaderTriggered,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        isDesktop,
    ]);
}
