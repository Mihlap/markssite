import { useCallback } from 'react';
import gsap from 'gsap';
import headerStyles from '../CompanyHistory/CompanyHistoryHeader.module.scss';

export function useCompanyHistoryAnimations({
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
}) {
    const exitCardsFocus = useCallback(
        (cardsEl) => {
            cardsFocusInProgressRef.current = true;
            hasScrollToHeaderTriggered.current = true;
            hasScrollToCardsTriggered.current = false;

            if (historyTagRef.current) {
                gsap.to(historyTagRef.current, { opacity: 0, duration: 0.2 });
            }

            const returnDuration = 1.0;
            const returnEase = 'power2.inOut';
            const tl = gsap.timeline({
                defaults: { duration: returnDuration, ease: returnEase },
                onComplete: () => {
                    cardsFocusInProgressRef.current = false;
                    setCardsFocused(false);
                    hasScrollToHeaderTriggered.current = false;
                    headerIntroArmedRef.current = true;

                    if (!animationReady || hasRestoreTriggered.current) return;
                    const marksGroup = marksGroupRef.current;
                    const title = titleRef.current;
                    const subtitleLine = subtitleLineRef.current;
                    const descLine1 = subtitleLine1Ref.current;
                    const descLine2 = subtitleLine2Ref.current;
                    if (!marksGroup || !title) return;

                    hasRestoreTriggered.current = true;
                    hasSplitTriggered.current = false;

                    const elements = [marksGroup, title, subtitleLine, descLine1, descLine2];
                    elements.forEach((el) => {
                        if (!el) return;
                        gsap.set(el, { clearProps: 'all' });
                        el.style.animation = '';
                        el.style.opacity = '';
                        el.style.transform = 'none';
                        el.classList.remove(headerStyles.animate);
                    });

                    requestAnimationFrame(() => {
                        window.dispatchEvent(new Event('scroll'));
                    });
                },
            });

            if (backgroundRef.current) {
                tl.to(backgroundRef.current, { y: 0 }, 0);
            }

            tl.to(cardsEl, { y: 0 }, 0);
        },
        [
            animationReady,
            historyTagRef,
            backgroundRef,
            marksGroupRef,
            titleRef,
            subtitleLineRef,
            subtitleLine1Ref,
            subtitleLine2Ref,
            cardsFocusInProgressRef,
            hasScrollToHeaderTriggered,
            hasScrollToCardsTriggered,
            hasRestoreTriggered,
            hasSplitTriggered,
            headerIntroArmedRef,
            setCardsFocused,
        ]
    );

    return { exitCardsFocus };
}
