import { useEffect } from 'react';
import gsap from 'gsap';
import { flushSync } from 'react-dom';
import headerStyles from '../../CompanyHistory/CompanyHistoryHeader.module.scss';

import {
    stopWheelHard,
    isHistoryActive,
    computeSnapY,
    getSectionAbs,
    shouldConsiderSnap,
    clearRecentlyExitedIfFar,
    getMaxHorizontalOffsetToCenterLast,
    setFocusPhaseEntering,
    setFocusPhaseReady,
    killVTween,
} from './wheelShared';

export function useWheelEnterSnap({
    sectionRef,
    cardsFocused,
    historyListRef,
    timelineWrapperRef,
    historyHeaderRef,
    marksGroupRef,
    titleRef,
    subtitleLineRef,
    subtitleLine1Ref,
    subtitleLine2Ref,
    backgroundRef,
    cardsFocusInProgressRef,
    exitToParentInProgressRef,
    hasScrollToCardsTriggered,
    hasScrollToHeaderTriggered,
    hasSplitTriggered,
    hasRestoreTriggered,
    textAnimationReady,
    headerIntroInProgressRef,
    returnedToSliderRef,
    setCardsFocused,
    showAndPlaceHistoryTag,
    hideHistoryTag,
    showYearsScale,
    hideYearsScale,
    horizontalOffsetRef,
    recentlyExitedCardsRef,
    vScrollYRef,
    lockScrollRef,
    lockYRef,
    applyingRef,
    vTweenRef,
}) {
    useEffect(() => {
        const SNAP_ZONE = 120;
        const STEP_CLAMP = 900;
        const EASE = 'power2.out';
        const DUR = 0.2;

        const activateCardsFocus = (timelineEl, cardsEl, fromBottom) => {
            hideHistoryTag?.(true);
            hideYearsScale?.(true);

            cardsFocusInProgressRef.current = true;

            if (fromBottom) {
                const maxOffset = getMaxHorizontalOffsetToCenterLast(timelineEl, horizontalOffsetRef);
                horizontalOffsetRef.current = maxOffset;
                gsap.set(timelineEl, { x: -maxOffset, force3D: true });
            } else {
                horizontalOffsetRef.current = 0;
                gsap.set(timelineEl, { x: 0, force3D: true });
            }

            cardsEl.style.marginTop = '0';
            cardsEl.style.marginBottom = '0';
            cardsEl.style.top = '0';
            cardsEl.style.height = '100vh';
            cardsEl.style.display = 'block';
            cardsEl.style.boxSizing = 'border-box';
            cardsEl.style.overflow = 'visible';
            cardsEl.style.overscrollBehavior = 'contain';

            setFocusPhaseEntering(sectionRef);

            flushSync(() => setCardsFocused(true));

            showYearsScale?.(false, { duration: 0.9, ease: 'power2.inOut' });

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const topAbs = cardsEl.getBoundingClientRect().top + window.pageYOffset;

                    applyingRef.current = true;
                    gsap.to(window, {
                        duration: 0.26,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        scrollTo: { y: topAbs, autoKill: false },
                        onUpdate: () => {
                            lockYRef.current = window.pageYOffset;
                            vScrollYRef.current = lockYRef.current;
                        },
                        onComplete: () => {
                            applyingRef.current = false;
                            cardsFocusInProgressRef.current = false;
                            lockScrollRef.current = false;

                            setFocusPhaseReady(sectionRef);

                            showAndPlaceHistoryTag?.();
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => showAndPlaceHistoryTag?.());
                            });
                        },
                    });
                });
            });
        };

        const onScroll = () => {
            if (!lockScrollRef.current) return;
            if (applyingRef.current) return;

            const y = window.pageYOffset;
            if (Math.abs(y - lockYRef.current) > 1) {
                applyingRef.current = true;
                window.scrollTo(0, lockYRef.current);
                applyingRef.current = false;
            }
        };

        const onWheel = (e) => {
            if (cardsFocused) return;
            if (exitToParentInProgressRef.current || returnedToSliderRef.current) return;
            if (!isHistoryActive(sectionRef, e)) return;

            const timelineEl = timelineWrapperRef.current;
            const cardsEl = historyListRef.current;
            if (!timelineEl || !cardsEl) return;

            const sectionAbs = getSectionAbs(sectionRef);
            const snapY = computeSnapY(timelineEl);
            const canEnter = clearRecentlyExitedIfFar(recentlyExitedCardsRef, snapY);

            const dyRaw = e.deltaY;
            const dx = e.deltaX || 0;
            if (Math.abs(dx) > Math.abs(dyRaw)) return;

            const y0 = window.pageYOffset;
            const dy = gsap.utils.clamp(-STEP_CLAMP, STEP_CLAMP, dyRaw);
            const y1 = y0 + dy;

            const needCatch = shouldConsiderSnap(y0, y1, snapY, sectionAbs, SNAP_ZONE);
            if (!needCatch) return;

            stopWheelHard(e);

            lockScrollRef.current = true;
            vScrollYRef.current = y0;
            lockYRef.current = y0;

            killVTween(vTweenRef);
            applyingRef.current = true;

            vTweenRef.current = gsap.to(window, {
                duration: DUR,
                ease: EASE,
                overwrite: 'auto',
                scrollTo: { y: snapY, autoKill: false },
                onUpdate: () => {
                    lockYRef.current = window.pageYOffset;
                    vScrollYRef.current = lockYRef.current;
                },
                onComplete: () => {
                    applyingRef.current = false;

                    if (!canEnter) {
                        lockScrollRef.current = false;
                        return;
                    }

                    const fromBottom = dy < 0;
                    activateCardsFocus(timelineEl, cardsEl, fromBottom);
                },
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheel, { passive: false, capture: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('wheel', onWheel, { capture: true });
            killVTween(vTweenRef);
            lockScrollRef.current = false;
            applyingRef.current = false;
        };
    }, [
        sectionRef,
        cardsFocused,
        historyListRef,
        timelineWrapperRef,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        returnedToSliderRef,
        setCardsFocused,
        horizontalOffsetRef,
        recentlyExitedCardsRef,
        vScrollYRef,
        lockScrollRef,
        lockYRef,
        applyingRef,
        vTweenRef,
        showAndPlaceHistoryTag,
        hideHistoryTag,
        showYearsScale,
        hideYearsScale,
    ]);

    useEffect(() => {
        const snap1 = gsap.utils?.snap ? gsap.utils.snap(1) : (v) => Math.round(v);

        const handleWheelDown = (e) => {
            if (!isHistoryActive(sectionRef, e)) return;
            if (e.deltaY <= 0) return;

            const headerEl = historyHeaderRef.current;
            const cardsEl = historyListRef.current;
            if (!headerEl || !cardsEl) return;

            const triggerY = window.innerHeight * 0.25;
            const headerRect = headerEl.getBoundingClientRect();
            const cardsRect = cardsEl.getBoundingClientRect();

            const isInHeader =
                triggerY >= headerRect.top &&
                triggerY <= headerRect.bottom &&
                !(triggerY >= cardsRect.top && triggerY <= cardsRect.bottom);

            if (!isInHeader) return;
            if (!textAnimationReady.current || headerIntroInProgressRef.current) return;
            if (hasScrollToCardsTriggered.current) return;
            if (cardsFocused || cardsFocusInProgressRef.current) return;

            const winY0 = window.pageYOffset;

            stopWheelHard(e);

            gsap.killTweensOf(window);
            window.scrollTo(0, winY0);

            hasScrollToCardsTriggered.current = true;
            hasScrollToHeaderTriggered.current = false;

            const marksGroup = marksGroupRef.current;
            const title = titleRef.current;
            const subtitleLine = subtitleLineRef.current;
            const descLine1 = subtitleLine1Ref.current;
            const descLine2 = subtitleLine2Ref.current;
            if (!marksGroup || !title) return;

            hasSplitTriggered.current = true;
            hasRestoreTriggered.current = false;

            gsap.killTweensOf([cardsEl, marksGroup, title, subtitleLine, descLine1, descLine2].filter(Boolean));

            [marksGroup, title, subtitleLine, descLine1, descLine2]
                .filter(Boolean)
                .forEach((el) => {
                    const x = gsap.getProperty(el, 'x');
                    const opacity = gsap.getProperty(el, 'opacity');
                    gsap.set(el, { x, opacity, force3D: true });
                    el.classList.remove(headerStyles.animate);
                    el.style.animation = 'none';
                    el.style.transition = 'none';
                });

            const tl = gsap.timeline({ defaults: { overwrite: 'auto', force3D: true }, paused: true });

            hideYearsScale?.(true);
            tl.call(() => showYearsScale?.(false, { duration: 1.2, ease: 'power2.inOut' }), null, 0);

            const backgroundEl = backgroundRef.current;
            if (backgroundEl) {
                const rect = backgroundEl.getBoundingClientRect();
                const shiftY = -Math.max(1, rect.height);
                tl.to(backgroundEl, { y: snap1(shiftY), duration: 1.2, ease: 'power2.inOut' }, 0);
            }

            tl.fromTo(
                marksGroup,
                { x: gsap.getProperty(marksGroup, 'x') || 0, opacity: gsap.getProperty(marksGroup, 'opacity') || 1 },
                { x: '-100vw', opacity: 0, duration: 0.8, ease: 'power2.in' },
                0
            );

            [title, subtitleLine, descLine1, descLine2].filter(Boolean).forEach((el) => {
                tl.fromTo(
                    el,
                    { x: gsap.getProperty(el, 'x') || 0, opacity: gsap.getProperty(el, 'opacity') || 1 },
                    { x: '100vw', opacity: 0, duration: 0.8, ease: 'power2.in' },
                    0
                );
            });

            const rectBefore = cardsEl.getBoundingClientRect();
            const topBefore = Math.round(rectBefore.top);
            const leftBefore = Math.round(rectBefore.left);

            const currentX = Number(gsap.getProperty(cardsEl, 'x') || 0);
            const currentY = Number(gsap.getProperty(cardsEl, 'y') || 0);

            cardsFocusInProgressRef.current = true;

            hideHistoryTag?.(true);
            setFocusPhaseEntering(sectionRef);

            cardsEl.style.willChange = 'transform';
            cardsEl.style.transition = 'none';
            cardsEl.style.transform = 'translateZ(0)';

            flushSync(() => setCardsFocused(true));

            const rectAfter = cardsEl.getBoundingClientRect();
            const topAfter = Math.round(rectAfter.top);
            const leftAfter = Math.round(rectAfter.left);

            const deltaX = leftBefore - leftAfter;
            const deltaY = topBefore - topAfter;

            let lockedX = snap1(currentX + deltaX);
            let initialY = snap1(currentY + deltaY);

            gsap.set(cardsEl, { x: lockedX, y: initialY, immediateRender: true, force3D: true });

            requestAnimationFrame(() => {
                const winY1 = window.pageYOffset;
                const deltaScroll = winY1 - winY0;

                if (Math.abs(deltaScroll) > 0.5) {
                    window.scrollTo(0, winY0);
                    const yNow = Number(gsap.getProperty(cardsEl, 'y') || 0);
                    gsap.set(cardsEl, { y: snap1(yNow - deltaScroll), immediateRender: true, force3D: true });
                }

                const r = cardsEl.getBoundingClientRect();
                const deltaLeft = Math.round(r.left) - leftBefore;

                if (Math.abs(deltaLeft) >= 1) {
                    const xNow = Number(gsap.getProperty(cardsEl, 'x') || 0);
                    lockedX = snap1(xNow - deltaLeft);
                    gsap.set(cardsEl, { x: lockedX, immediateRender: true, force3D: true });
                }

                const rectStable = cardsEl.getBoundingClientRect();
                const topStable = Math.round(rectStable.top);
                const yNow = Number(gsap.getProperty(cardsEl, 'y') || 0);

                const targetTopInViewport = 0;
                const shiftY = targetTopInViewport - topStable;
                const finalY = snap1(yNow + shiftY);

                tl.to(
                    cardsEl,
                    {
                        x: lockedX,
                        y: finalY,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        overwrite: 'auto',
                        autoRound: true,
                        onUpdate: () => {
                            const cx = Number(gsap.getProperty(cardsEl, 'x') || 0);
                            if (Math.abs(cx - lockedX) > 0.1) {
                                gsap.set(cardsEl, { x: lockedX, immediateRender: true });
                            }
                        },
                        onComplete: () => {
                            cardsEl.style.width = '';
                            cardsEl.style.minWidth = '';
                            cardsEl.style.maxWidth = '';
                            cardsEl.style.height = '';
                            cardsEl.style.minHeight = '';
                            cardsEl.style.willChange = '';
                            cardsEl.style.transition = '';

                            cardsFocusInProgressRef.current = false;
                            setFocusPhaseReady(sectionRef);

                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => showAndPlaceHistoryTag?.());
                            });
                        },
                    },
                    0
                );

                tl.play(0);
            });
        };

        window.addEventListener('wheel', handleWheelDown, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelDown);
    }, [
        sectionRef,
        cardsFocused,
        historyHeaderRef,
        historyListRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        backgroundRef,
        cardsFocusInProgressRef,
        textAnimationReady,
        headerIntroInProgressRef,
        hasScrollToCardsTriggered,
        hasScrollToHeaderTriggered,
        hasSplitTriggered,
        hasRestoreTriggered,
        setCardsFocused,
        showAndPlaceHistoryTag,
        hideHistoryTag,
        showYearsScale,
        hideYearsScale,
    ]);
}
