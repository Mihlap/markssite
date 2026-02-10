import { useEffect } from 'react';
import gsap from 'gsap';
import headerStyles from '../../CompanyHistory/CompanyHistoryHeader.module.scss';
import { isHistoryActive, stopWheelHard, clearFocusPhase } from './wheelShared';

export function useWheelExitToParent({
    sectionRef,
    cardsFocused,
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
}) {
    useEffect(() => {
        const handleWheelExitUp = (e) => {
            if (!isHistoryActive(sectionRef, e)) return;
            if (e.deltaY >= 0) return;
            if (cardsFocused || cardsFocusInProgressRef.current) return;

            if (exitToParentInProgressRef.current) {
                stopWheelHard(e);
                return;
            }

            const headerEl = historyHeaderRef.current;
            if (!headerEl) return;

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
                gsap.set(historyTagRef.current, { autoAlpha: 0, y: 0 });
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
                y = Math.max(0, sliderAbsoluteBottom - window.innerHeight + bottomOffset);
            } else if (parentEl) {
                const r = parentEl.getBoundingClientRect();
                y = Math.max(0, r.top + window.pageYOffset);
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
                { x: gsap.getProperty(marksGroup, 'x') || 0, opacity: gsap.getProperty(marksGroup, 'opacity') || 1 },
                { x: '-100vw', opacity: 0, duration: textAnimationDuration, immediateRender: true },
                0
            );

            [title, subtitleLine, descLine1, descLine2]
                .filter(Boolean)
                .forEach((el) => {
                    tl.fromTo(
                        el,
                        { x: gsap.getProperty(el, 'x') || 0, opacity: gsap.getProperty(el, 'opacity') || 1 },
                        { x: '100vw', opacity: 0, duration: textAnimationDuration, immediateRender: true },
                        0
                    );
                });
        };

        window.addEventListener('wheel', handleWheelExitUp, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelExitUp);
    }, [
        sectionRef,
        cardsFocused,
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
    ]);
}
