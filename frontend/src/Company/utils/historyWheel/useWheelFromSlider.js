import { useEffect } from 'react';
import gsap from 'gsap';
import headerStyles from '../../CompanyHistory/CompanyHistoryHeader.module.scss';
import { isEventInsideModal } from './wheelShared';

export function useWheelFromSlider({
    sectionRef,
    cardsFocused,
    sliderRef,
    historyHeaderRef,
    returnedToSliderRef,
    cardsFocusInProgressRef,
    exitToParentInProgressRef,
    textAnimationReady,
    headerIntroInProgressRef,
    hasScrollToHeaderTriggered,
    hasSplitTriggered,
    hasRestoreTriggered,
    headerIntroArmedRef,
    marksGroupRef,
    titleRef,
    subtitleLineRef,
    subtitleLine1Ref,
    subtitleLine2Ref,
}) {
    useEffect(() => {
        const handleWheelFromSlider = (e) => {
            if (isEventInsideModal(e)) return;
            const root = sectionRef?.current;
            if (!root) return;

            const r = root.getBoundingClientRect();
            const near = r.top < window.innerHeight * 1.2 && r.bottom > -window.innerHeight * 0.2;
            if (!near) return;

            if (e.deltaY <= 0) return;
            if (!returnedToSliderRef.current) return;
            if (cardsFocused || cardsFocusInProgressRef.current) return;
            if (exitToParentInProgressRef.current) return;

            const sliderEl = sliderRef?.current;
            const headerEl = historyHeaderRef.current;
            if (!sliderEl || !headerEl) return;

            const sliderRect = sliderEl.getBoundingClientRect();
            const isSliderVisible = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;
            if (!isSliderVisible) return;

            e.preventDefault();
            e.stopPropagation();

            returnedToSliderRef.current = false;

            textAnimationReady.current = false;
            if (headerIntroArmedRef) headerIntroArmedRef.current = true;
            headerIntroInProgressRef.current = false;
            hasScrollToHeaderTriggered.current = false;
            hasSplitTriggered.current = false;
            hasRestoreTriggered.current = false;

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

            const headerRect = headerEl.getBoundingClientRect();
            const headerAbsoluteTop = headerRect.top + window.pageYOffset;
            const topOffset = 40;
            const targetY = Math.max(0, headerAbsoluteTop - topOffset);

            gsap.to(window, {
                duration: 0.8,
                ease: 'power2.inOut',
                scrollTo: { y: targetY, autoKill: false },
                onComplete: () => requestAnimationFrame(() => window.dispatchEvent(new Event('scroll'))),
            });
        };

        window.addEventListener('wheel', handleWheelFromSlider, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelFromSlider);
    }, [
        sectionRef,
        cardsFocused,
        sliderRef,
        historyHeaderRef,
        returnedToSliderRef,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        textAnimationReady,
        headerIntroInProgressRef,
        hasScrollToHeaderTriggered,
        hasSplitTriggered,
        hasRestoreTriggered,
        headerIntroArmedRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
    ]);
}
