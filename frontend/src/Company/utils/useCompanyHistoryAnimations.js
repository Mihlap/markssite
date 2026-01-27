import { useCallback } from 'react';
import gsap from 'gsap';
import { flushSync } from 'react-dom';
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

            const rectBeforeAnimation = cardsEl.getBoundingClientRect();
            const widthBeforeAnimation = rectBeforeAnimation.width;
            const heightBeforeAnimation = rectBeforeAnimation.height;
            const currentY = gsap.getProperty(cardsEl, 'y') || 0;
            const currentX = gsap.getProperty(cardsEl, 'x') || 0;


            cardsEl.style.willChange = 'transform';
            cardsEl.style.transform = 'translateZ(0)';
            cardsEl.style.width = `${widthBeforeAnimation}px`;
            cardsEl.style.minWidth = `${widthBeforeAnimation}px`;
            cardsEl.style.maxWidth = `${widthBeforeAnimation}px`;
            cardsEl.style.height = `${heightBeforeAnimation}px`;
            cardsEl.style.minHeight = `${heightBeforeAnimation}px`;


            const tl = gsap.timeline({
                defaults: { duration: returnDuration, ease: returnEase },
                onComplete: () => {
                    const rectBefore = cardsEl.getBoundingClientRect();
                    const topBefore = rectBefore.top;
                    const leftBefore = rectBefore.left;

                    cardsEl.style.willChange = 'transform';
                    cardsEl.style.transform = 'translateZ(0)';
                    cardsEl.style.opacity = '0';
                    cardsEl.style.pointerEvents = 'none';
                    cardsEl.style.visibility = 'hidden';

                    const currentXBeforeReset = gsap.getProperty(cardsEl, 'x') || 0;
                    const currentYBeforeReset = gsap.getProperty(cardsEl, 'y') || 0;


                    gsap.set(cardsEl, { x: 0, y: 0, clearProps: 'transform' });

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            flushSync(() => {
                                setCardsFocused(false);
                            });

                            const rectAfter = cardsEl.getBoundingClientRect();
                            const topAfter = rectAfter.top;
                            const leftAfter = rectAfter.left;
                            const layoutJumpY = topAfter - topBefore;
                            const layoutJumpX = leftAfter - leftBefore;


                            if (Math.abs(layoutJumpY) > 0.5 || Math.abs(layoutJumpX) > 0.5) {
                                const compensationX = currentXBeforeReset - layoutJumpX;
                                const compensationY = currentYBeforeReset - layoutJumpY;

                                gsap.set(cardsEl, {
                                    x: compensationX,
                                    y: compensationY,
                                    immediateRender: true,
                                    force3D: true,
                                });
                                cardsEl.style.transform = `translateZ(0) translate(${compensationX}px, ${compensationY}px)`;
                            }

                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    cardsEl.style.width = '';
                                    cardsEl.style.minWidth = '';
                                    cardsEl.style.maxWidth = '';
                                    cardsEl.style.height = '';
                                    cardsEl.style.minHeight = '';
                                    cardsEl.style.opacity = '';
                                    cardsEl.style.pointerEvents = '';
                                    cardsEl.style.visibility = '';
                                    cardsEl.style.willChange = '';

                                    gsap.set(cardsEl, { x: 0, y: 0, clearProps: 'transform' });
                                });
                            });
                        });
                    });

                    cardsFocusInProgressRef.current = false;
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

            tl.fromTo(
                cardsEl,
                { x: currentX, y: currentY },
                {
                    x: currentX,
                    y: 0,
                    duration: returnDuration,
                    ease: returnEase,
                    onUpdate: () => {
                        const currentXDuring = gsap.getProperty(cardsEl, 'x') || 0;
                        if (Math.abs(currentXDuring - currentX) > 0.1) {
                            gsap.set(cardsEl, { x: currentX, immediateRender: true });
                        }
                    },
                },
                0
            );
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
