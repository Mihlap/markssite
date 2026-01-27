import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { flushSync } from 'react-dom';
import headerStyles from '../CompanyHistory/CompanyHistoryHeader.module.scss';

export function useCompanyHistoryWheelHandlers({
    sectionRef,
    // inView,
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
}) {
    const horizontalOffsetRef = useRef(0);

    const isHistoryActive = (e) => {
        const root = sectionRef?.current;
        if (!root) return false;

        const r = root.getBoundingClientRect();
        const visible = r.bottom > 0 && r.top < window.innerHeight;
        if (!visible) return false;

        const t = e?.target;
        if (t && root.contains(t)) return true;

        const probeY = window.innerHeight * 0.35;
        return probeY >= r.top && probeY <= r.bottom;
    };

    useEffect(() => {
        const handleWheelUp = (e) => {
            if (!isHistoryActive(e)) return;
            if (e.deltaY >= 0) return;

            const cardsEl = historyListRef.current;
            const timelineEl = timelineWrapperRef.current;
            if (!cardsEl) return;

            if (!cardsFocused || cardsFocusInProgressRef.current) return;

            const hasVerticalOverflow = cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (hasVerticalOverflow && cardsEl.scrollTop > 1) return;         
            if (horizontalOffsetRef.current > 1) return;
      
            if (timelineEl) {
                const rect = timelineEl.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const inViewport = centerY > 100 && centerY < window.innerHeight - 100;
                if (inViewport) return;
            }

            e.preventDefault();
            e.stopPropagation();

            exitCardsFocus(cardsEl);
        };

        window.addEventListener('wheel', handleWheelUp, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelUp);
    }, [
        sectionRef,
        cardsFocused,
        exitCardsFocus,
        historyListRef,
        timelineWrapperRef,
        cardsFocusInProgressRef,
    ]);

    useEffect(() => {
        const handleWheelDownExit = (e) => {
            if (!isHistoryActive(e)) return;
            if (e.deltaY <= 0) return;

            const cardsEl = historyListRef.current;
            const timelineEl = timelineWrapperRef.current;
            if (!cardsEl) return;
            if (!cardsFocused || cardsFocusInProgressRef.current) return;

            const hasVerticalOverflow = cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (hasVerticalOverflow) {
                const maxScrollTop = cardsEl.scrollHeight - cardsEl.clientHeight;
                if (cardsEl.scrollTop < maxScrollTop - 1) return;
            }

            if (timelineEl) {
                const maxScrollLeft = timelineEl.scrollWidth - timelineEl.clientWidth;
                if (timelineEl.scrollLeft < maxScrollLeft - 1) return;
            }

            e.preventDefault();
            e.stopPropagation();

            exitCardsFocus(cardsEl);
        };

        window.addEventListener('wheel', handleWheelDownExit, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelDownExit);
    }, [
        sectionRef,
        cardsFocused,
        exitCardsFocus,
        historyListRef,
        timelineWrapperRef,
        cardsFocusInProgressRef,
    ]);

    useEffect(() => {
        const handleWheelExitUp = (e) => {
            if (!isHistoryActive(e)) return;

            if (e.deltaY >= 0) return;
            if (cardsFocused || cardsFocusInProgressRef.current) return;

            if (exitToParentInProgressRef.current) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                return;
            }

            const headerEl = historyHeaderRef.current;
            if (!headerEl) return;

            const isIntroActive = headerIntroInProgressRef.current || !textAnimationReady.current;

            const headerRect = headerEl.getBoundingClientRect();
            const pointerY = Number.isFinite(e.clientY) ? e.clientY : null;
            const triggerY = window.innerHeight * 0.25;
            const probeY = pointerY ?? triggerY;

            const isPointerInHeader = probeY >= headerRect.top && probeY <= headerRect.bottom;
            const isTriggerPointInHeader = triggerY >= headerRect.top && triggerY <= headerRect.bottom;
            const isHeaderVisibleDuringIntro =
                isIntroActive && headerRect.top < window.innerHeight * 0.6 && headerRect.bottom > 0;

            const isInHeader = isPointerInHeader || isTriggerPointInHeader || isHeaderVisibleDuringIntro;
            if (!isInHeader) return;

            if (isIntroActive) {
                headerIntroInProgressRef.current = false;
                textAnimationReady.current = true;
            }

            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

            gsap.killTweensOf(window);

            exitToParentInProgressRef.current = true;
            hasSplitTriggered.current = true;
            hasRestoreTriggered.current = false;

            if (historyTagRef.current) {
                gsap.to(historyTagRef.current, { opacity: 0, duration: 0.2 });
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
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        headerIntroInProgressRef,
        textAnimationReady,
        hasSplitTriggered,
        hasRestoreTriggered,
        hasScrollToHeaderTriggered,
        returnedToSliderRef,
        headerIntroArmedRef,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
    ]);

    useEffect(() => {
        const handleWheelFromSlider = (e) => {
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
                onComplete: () => {
                    requestAnimationFrame(() => {
                        window.dispatchEvent(new Event('scroll'));
                    });
                },
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

    useEffect(() => {
        const snap1 = gsap.utils?.snap ? gsap.utils.snap(1) : (v) => Math.round(v);

        const handleWheelDown = (e) => {
            if (!isHistoryActive(e)) return;
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

            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

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

            [marksGroup, title, subtitleLine, descLine1, descLine2].filter(Boolean).forEach((el) => {
                const x = gsap.getProperty(el, 'x');
                const opacity = gsap.getProperty(el, 'opacity');
                gsap.set(el, { x, opacity, force3D: true });
                el.classList.remove(headerStyles.animate);
                el.style.animation = 'none';
                el.style.transition = 'none';
            });

            const tl = gsap.timeline({ defaults: { overwrite: 'auto', force3D: true } });

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
            const topBefore = rectBefore.top;
            const leftBefore = rectBefore.left;

            const widthBefore = rectBefore.width;
            const heightBefore = rectBefore.height;

            const currentXBefore = Number(gsap.getProperty(cardsEl, 'x') || 0);
            const currentYBefore = Number(gsap.getProperty(cardsEl, 'y') || 0);

            cardsEl.style.willChange = 'transform';
            cardsEl.style.transition = 'none';
            cardsEl.style.transform = 'translateZ(0)';

            cardsEl.style.width = `${widthBefore}px`;
            cardsEl.style.minWidth = `${widthBefore}px`;
            cardsEl.style.maxWidth = `${widthBefore}px`;
            cardsEl.style.height = `${heightBefore}px`;
            cardsEl.style.minHeight = `${heightBefore}px`;
            cardsEl.style.position = 'relative';

            cardsFocusInProgressRef.current = true;

            const paddingTopAfter =
                parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--history-tag-safe-top')) || 72;

            cardsEl.style.marginTop = '0';
            cardsEl.style.marginBottom = '0';
            cardsEl.style.paddingTop = `${paddingTopAfter}px`;
            cardsEl.style.paddingBottom = '24px';
            cardsEl.style.top = '0';
            cardsEl.style.height = '100vh';
            cardsEl.style.display = 'block';
            cardsEl.style.boxSizing = 'border-box';

            cardsEl.style.overflowY = 'scroll';
            cardsEl.style.overflowX = 'hidden';

            cardsEl.style.overscrollBehavior = 'contain';
            cardsEl.style.scrollbarWidth = 'none';

            const rectAfterInline = cardsEl.getBoundingClientRect();
            const inlineJumpY = rectAfterInline.top - topBefore;

            let lockedX = snap1(currentXBefore);
            let initialY = snap1(currentYBefore - inlineJumpY);

            gsap.set(cardsEl, { x: lockedX, y: initialY, immediateRender: true, force3D: true });

            flushSync(() => {
                setCardsFocused(true);
            });

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const winY1 = window.pageYOffset;
                    const deltaScroll = winY1 - winY0;

                    if (Math.abs(deltaScroll) > 0.5) {
                        window.scrollTo(0, winY0);
                        const yNow = Number(gsap.getProperty(cardsEl, 'y') || 0);
                        gsap.set(cardsEl, { y: snap1(yNow - deltaScroll), immediateRender: true, force3D: true });
                    }

                    const r = cardsEl.getBoundingClientRect();
                    const deltaLeft = Math.round(r.left) - Math.round(leftBefore);

                    if (Math.abs(deltaLeft) >= 1) {
                        const xNow = Number(gsap.getProperty(cardsEl, 'x') || 0);
                        lockedX = snap1(xNow - deltaLeft);
                        gsap.set(cardsEl, { x: lockedX, immediateRender: true, force3D: true });
                    }

                    const rectStable = cardsEl.getBoundingClientRect();
                    const topStable = rectStable.top;

                    const yNow = Number(gsap.getProperty(cardsEl, 'y') || 0);

                    const targetTopInViewport = 137;
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

                                if (historyTagRef.current) {
                                    gsap.set(historyTagRef.current, { opacity: 0 });
                                    gsap.to(historyTagRef.current, {
                                        opacity: 1,
                                        duration: 0.6,
                                        ease: 'power2.out',
                                        delay: 0.1,
                                        overwrite: 'auto',
                                    });
                                }

                                cardsFocusInProgressRef.current = false;
                            },
                        },
                        0
                    );
                });
            });
        };

        window.addEventListener('wheel', handleWheelDown, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelDown);
    }, [
        sectionRef,
        cardsFocused,
        historyHeaderRef,
        historyListRef,
        historyTagRef,
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
    ]);
   
    useEffect(() => {
        const container = timelineWrapperRef.current;
        if (!container) return;

        const MARGIN = 50;
   
        const getCurrentOffset = () => horizontalOffsetRef.current;
        const setCurrentOffset = (val) => { horizontalOffsetRef.current = val; };

        const getLastCard = () => {
            const groups = container.querySelectorAll('[data-last-cards="true"]');
            if (!groups.length) return null;

            let rightmost = null;
            let maxRight = -Infinity;

            groups.forEach(group => {
                const cards = group.querySelectorAll('[class*="history_card_wrapper"]');
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    if (rect.right > maxRight) {
                        maxRight = rect.right;
                        rightmost = card;
                    }
                });
                if (!cards.length) {
                    const rect = group.getBoundingClientRect();
                    if (rect.right > maxRight) {
                        maxRight = rect.right;
                        rightmost = group;
                    }
                }
            });

            return rightmost;
        };
    
        const getMaxOffset = () => {
            const lastCard = getLastCard();
            if (!lastCard) return 0;

            const rect = lastCard.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2 + getCurrentOffset();
            const viewportCenterX = window.innerWidth / 2;

            return Math.max(0, cardCenterX - viewportCenterX);
        };
    
        const isLastCardCentered = () => {
            const lastCard = getLastCard();
            if (!lastCard) return true;

            const rect = lastCard.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const viewportCenterX = window.innerWidth / 2;

            return cardCenterX <= viewportCenterX + MARGIN;
        };

        const applyTransform = (offset) => {
            setCurrentOffset(offset);
            container.style.transform = `translateX(${-offset}px)`;
        };

        const handleWheelHorizontal = (e) => {
            if (!cardsFocused) return;
            if (cardsFocusInProgressRef.current) return;

            const dy = e.deltaY;
            const dx = e.deltaX || 0;

            const isVerticalWheel = Math.abs(dy) > Math.abs(dx);
            if (!isVerticalWheel || Math.abs(dy) <= 2) return;

            const down = dy > 0;
            const up = dy < 0;

            const maxOffset = getMaxOffset();
            const currentOffset = getCurrentOffset();

            if (down) {
                const centered = isLastCardCentered();
                const atMax = currentOffset >= maxOffset;

                if (centered || atMax) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                    window.scrollBy({ top: Math.abs(dy), behavior: 'auto' });
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

                const step = Math.min(Math.abs(dy) * 2, 200);
                const newOffset = Math.min(currentOffset + step, maxOffset);
                applyTransform(newOffset);
                return;
            }

            if (up) {            
                const rect = container.getBoundingClientRect();
                const containerCenterY = rect.top + rect.height / 2;
                const cardsInViewport = containerCenterY > 100 && containerCenterY < window.innerHeight - 100;
           
                if (!cardsInViewport) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                    window.scrollBy({ top: -Math.abs(dy), behavior: 'auto' });
                    return;
                }
             
                if (currentOffset <= 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                    window.scrollBy({ top: -Math.abs(dy), behavior: 'auto' });
                    return;
                }
            
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

                const step = Math.min(Math.abs(dy) * 2, 200);
                const newOffset = Math.max(0, currentOffset - step);
                applyTransform(newOffset);
            }
        };
 
        if (!cardsFocused) {
            container.style.transform = '';
            setCurrentOffset(0);
        }

        window.addEventListener('wheel', handleWheelHorizontal, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheelHorizontal);
            container.style.transform = '';
        };
    }, [cardsFocused, timelineWrapperRef, cardsFocusInProgressRef]);
}