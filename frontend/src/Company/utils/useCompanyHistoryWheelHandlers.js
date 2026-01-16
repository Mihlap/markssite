import { useEffect } from 'react';
import gsap from 'gsap';
import { flushSync } from 'react-dom';
import headerStyles from '../CompanyHistory/CompanyHistoryHeader.module.scss';

export function useCompanyHistoryWheelHandlers({
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
}) {
    useEffect(() => {
        if (!inView) return;

        const handleWheelUp = (e) => {
            if (e.deltaY >= 0) return;

            const cardsEl = historyListRef.current;
            const timelineEl = timelineWrapperRef.current;
            if (!cardsEl) return;

            if (!cardsFocused || cardsFocusInProgressRef.current) return;

            const hasVerticalOverflow = cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (hasVerticalOverflow && cardsEl.scrollTop > 1) return;

            const canScrollLeft = timelineEl && timelineEl.scrollLeft > 1;
            if (canScrollLeft) return;

            e.preventDefault();
            e.stopPropagation();

            exitCardsFocus(cardsEl);
        };

        window.addEventListener('wheel', handleWheelUp, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelUp);
    }, [inView, cardsFocused, exitCardsFocus, historyListRef, timelineWrapperRef, cardsFocusInProgressRef]);

    useEffect(() => {
        if (!inView) return;

        const handleWheelDownExit = (e) => {
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
    }, [inView, cardsFocused, exitCardsFocus, historyListRef, timelineWrapperRef, cardsFocusInProgressRef]);

    useEffect(() => {
        if (!inView) return;

        const handleWheelExitUp = (e) => {
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
            const isHeaderVisibleDuringIntro = isIntroActive && headerRect.top < window.innerHeight * 0.6 && headerRect.bottom > 0;
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
            let y = 0;

            if (sliderEl) {
                const sliderRect = sliderEl.getBoundingClientRect();
                const sliderAbsoluteBottom = sliderRect.bottom + window.pageYOffset;
                const bottomOffset = 60;
                y = Math.max(0, sliderAbsoluteBottom - window.innerHeight + bottomOffset);
            } else {
                y = 0;
            }

            const isDuringIntro = isIntroActive;
            const scrollDuration = isDuringIntro ? 0.7 : 0.85;
            requestAnimationFrame(() => {
                gsap.to(window, {
                    duration: scrollDuration,
                    ease: 'power2.inOut',
                    overwrite: 'auto',
                    scrollTo: { y, autoKill: false },
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

            [title, subtitleLine, descLine1, descLine2].filter(Boolean).forEach((el) => {
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
        inView,
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
        if (!inView) return;

        const handleWheelFromSlider = (e) => {
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
        inView,
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
        if (!inView) return;

        const handleWheelDown = (e) => {
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

            e.preventDefault();
            e.stopPropagation();

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

            const headerTop = headerRect.top + window.pageYOffset;

            const elements = [marksGroup, title, subtitleLine, descLine1, descLine2];
            elements.forEach((el) => {
                if (!el) return;
                const x = gsap.getProperty(el, 'x');
                const opacity = gsap.getProperty(el, 'opacity');
                gsap.set(el, { x, opacity });
                el.classList.remove(headerStyles.animate);
                el.style.animation = 'none';
            });

            if (historyTagRef.current) {
                gsap.fromTo(
                    historyTagRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 }
                );
            }

            const tl = gsap.timeline();

            const backgroundEl = backgroundRef.current;
            if (backgroundEl) {
                const rect = backgroundEl.getBoundingClientRect();
                const shiftY = -Math.max(1, rect.height);
                tl.to(
                    backgroundEl,
                    { y: shiftY, duration: 1.2, ease: 'power2.inOut', force3D: true },
                    0
                );
            }

            tl.fromTo(
                marksGroup,
                { x: gsap.getProperty(marksGroup, 'x') || 0, opacity: gsap.getProperty(marksGroup, 'opacity') || 1 },
                { x: '-100vw', opacity: 0, duration: 0.8, ease: 'power2.in', force3D: true },
                0
            );

            [title, subtitleLine, descLine1, descLine2].filter(Boolean).forEach((el) => {
                tl.fromTo(
                    el,
                    { x: gsap.getProperty(el, 'x') || 0, opacity: gsap.getProperty(el, 'opacity') || 1 },
                    { x: '100vw', opacity: 0, duration: 0.8, ease: 'power2.in', force3D: true },
                    0
                );
            });

            const rectBefore = cardsEl.getBoundingClientRect();
            const topBefore = rectBefore.top;

            cardsEl.style.willChange = 'transform';
            cardsEl.style.transform = 'translateZ(0)';
            cardsEl.style.opacity = '0';
            cardsEl.style.pointerEvents = 'none';
            cardsEl.style.visibility = 'hidden';

            gsap.set(cardsEl, { y: 0, clearProps: 'transform' });
            cardsFocusInProgressRef.current = true;

            flushSync(() => {
                setCardsFocused(true);
            });

            const rectAfter = cardsEl.getBoundingClientRect();
            const topAfter = rectAfter.top;
            const layoutJump = topAfter - topBefore;

            if (Math.abs(layoutJump) > 0.5) {
                cardsEl.style.transform = `translateZ(0) translateY(${-layoutJump}px)`;
                gsap.set(cardsEl, {
                    y: -layoutJump,
                    immediateRender: true,
                    force3D: true,
                });
            }

            cardsEl.style.opacity = '';
            cardsEl.style.pointerEvents = '';
            cardsEl.style.visibility = '';

            requestAnimationFrame(() => {
                const rectFinal = cardsEl.getBoundingClientRect();
                const cardsTopInViewport = rectFinal.top;

                let targetTopInViewport = 0;
                const tagEl = historyTagRef.current;
                if (tagEl) {
                    const tagRect = tagEl.getBoundingClientRect();
                    const tagHeight = tagRect.height;
                    const fixedTagTop = 24;
                    const gap = 12;
                    const cardsStyles = window.getComputedStyle(cardsEl);
                    const paddingTop = parseFloat(cardsStyles.paddingTop) || 0;
                    const tagBottomInFixed = fixedTagTop + tagHeight + gap;
                    targetTopInViewport = tagBottomInFixed - paddingTop;
                    targetTopInViewport = Math.min(targetTopInViewport, 120);
                }

                const shiftY = targetTopInViewport - cardsTopInViewport;

                const currentY = gsap.getProperty(cardsEl, 'y') || 0;
                tl.to(
                    cardsEl,
                    {
                        y: currentY + shiftY,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            cardsFocusInProgressRef.current = false;
                            cardsEl.style.willChange = '';
                        },
                    },
                    0
                );
            });
        };

        window.addEventListener('wheel', handleWheelDown, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelDown);
    }, [
        inView,
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
        if (!timelineWrapperRef.current || !inView) return;

        const container = timelineWrapperRef.current;
        let scrollTimeout = null;

        const handleWheel = (e) => {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportCenter = viewportHeight / 2;
            const containerCenter = rect.top + rect.height / 2;
            const isInCenter = Math.abs(containerCenter - viewportCenter) < viewportHeight * 0.4;
            const cardsEl = historyListRef.current;
            const hasVerticalOverflow =
                !!cardsEl && cardsFocused && cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (!isInCenter) {
                const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX || 0);
                if (cardsFocused && isVerticalScroll && Math.abs(e.deltaY) > 5 && !hasVerticalOverflow) {
                    e.preventDefault();
                }
                return;
            }

            const { deltaY } = e;
            const isVerticalScroll = Math.abs(deltaY) > Math.abs(e.deltaX || 0);
            if (!isVerticalScroll || Math.abs(deltaY) <= 5) return;

            if (hasVerticalOverflow && !e.shiftKey) return;

            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            const canScrollRight = deltaY > 0 && container.scrollLeft < maxScrollLeft - 1;
            const canScrollLeft = deltaY < 0 && container.scrollLeft > 1;
            if (!canScrollRight && !canScrollLeft) {
                if (cardsFocused && !hasVerticalOverflow) e.preventDefault();
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (scrollTimeout) clearTimeout(scrollTimeout);

            container.scrollBy({
                left: deltaY * 0.5,
                behavior: 'smooth',
            });

            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
            }, 150);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [inView, cardsFocused, timelineWrapperRef, historyListRef]);
}
