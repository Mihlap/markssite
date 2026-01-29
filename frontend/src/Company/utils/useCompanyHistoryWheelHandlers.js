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
    const recentlyExitedCardsRef = useRef(false);  // Блокирует повторный snap после выхода из карточек

    // Утилита для получения последней карточки
    const getLastCard = (container) => {
        if (!container) return null;
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

    // Утилита для расчёта максимального горизонтального offset
    const getMaxHorizontalOffset = (container) => {
        const lastCard = getLastCard(container);
        if (!lastCard) return 0;

        const rect = lastCard.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2 + horizontalOffsetRef.current;
        const viewportCenterX = window.innerWidth / 2;

        return Math.max(0, cardCenterX - viewportCenterX);
    };

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

            // Блокируем повторный snap на 2 секунды после выхода
            recentlyExitedCardsRef.current = true;
            setTimeout(() => {
                recentlyExitedCardsRef.current = false;
            }, 2000);

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

    // handleWheelDownExit убран - когда последняя карточка видима,
    // handleWheelHorizontal просто не блокирует event и страница скроллится вниз

    // Snap к карточкам истории - обязательная остановка когда линия приближается к центру
    useEffect(() => {
        const activateCardsFocus = (timelineEl, cardsEl, sectionEl, isFromBottom) => {
            cardsFocusInProgressRef.current = true;

            // Устанавливаем offset
            if (isFromBottom) {
                const maxOffset = getMaxHorizontalOffset(timelineEl);
                horizontalOffsetRef.current = maxOffset;
                timelineEl.style.transform = `translateX(${-maxOffset}px)`;
            } else {
                horizontalOffsetRef.current = 0;
                timelineEl.style.transform = 'translateX(0px)';
            }

            // Применяем inline стили
            cardsEl.style.marginTop = '0';
            cardsEl.style.marginBottom = '0';
            cardsEl.style.padding = '0';
            cardsEl.style.top = '0';
            cardsEl.style.height = '100vh';
            cardsEl.style.display = 'block';
            cardsEl.style.boxSizing = 'border-box';
            cardsEl.style.overflow = 'visible';
            cardsEl.style.overscrollBehavior = 'contain';

            flushSync(() => {
                setCardsFocused(true);
            });

            // После применения стилей вычисляем точную позицию и скроллим
            requestAnimationFrame(() => {
                // cardsEl теперь имеет height: 100vh и grid центрирует линию на 50vh
                // Нужно скроллить так, чтобы верх cardsEl был на уровне 0 viewport
                const cardsAbsoluteTop = cardsEl.getBoundingClientRect().top + window.pageYOffset;
                const targetScrollY = cardsAbsoluteTop;

                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'auto'
                });

                // Корректировка: убедиться что линия точно по центру
                requestAnimationFrame(() => {
                    const lineEl = timelineEl.querySelector('[class*="timeline_line"]');
                    if (lineEl) {
                        const lineRect = lineEl.getBoundingClientRect();
                        const lineCenter = lineRect.top + lineRect.height / 2;
                        const viewportCenter = window.innerHeight / 2;
                        const offset = lineCenter - viewportCenter;

                        // Если линия не по центру - корректируем скролл
                        if (Math.abs(offset) > 5) {
                            window.scrollBy({
                                top: offset,
                                behavior: 'auto'
                            });
                        }
                    }

                    cardsFocusInProgressRef.current = false;
                });
            });
        };

        const handleWheelSnapToCards = (e) => {
            // Только когда cardsFocused = false (ещё не вошли в режим карточек)
            if (cardsFocused || cardsFocusInProgressRef.current) return;
            // Не снэпать если выходим к родителю или уже вышли
            if (exitToParentInProgressRef.current || returnedToSliderRef.current) return;
            // Не снэпать сразу после выхода из карточек
            if (recentlyExitedCardsRef.current) return;

            const timelineEl = timelineWrapperRef.current;
            const cardsEl = historyListRef.current;
            const sectionEl = sectionRef.current;
            if (!timelineEl || !cardsEl || !sectionEl) return;

            const sectionRect = sectionEl.getBoundingClientRect();
            // Секция должна быть видима
            if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) return;

            // Позиция линии относительно viewport
            // При обычном режиме линия в timeline_wrapper
            const timelineRect = timelineEl.getBoundingClientRect();
            const lineY = timelineRect.top + timelineRect.height / 2;
            const centerY = window.innerHeight / 2;
            const threshold = 200; // Порог приближения к центру

            const dy = e.deltaY;
            const down = dy > 0;
            const up = dy < 0;

            // Скролл вниз - линия приближается к центру сверху
            if (down && lineY > centerY - threshold && lineY < centerY + threshold * 2) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

                activateCardsFocus(timelineEl, cardsEl, sectionEl, false);
                return;
            }

            // Скролл вверх - линия приближается к центру снизу
            if (up && lineY > centerY - threshold * 2 && lineY < centerY + threshold) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

                activateCardsFocus(timelineEl, cardsEl, sectionEl, true);
                return;
            }
        };

        // Дополнительный scroll listener для отлова быстрого скролла
        let lastLineY = null;
        let scrollSnapPending = false;

        const handleScrollSnap = () => {
            if (cardsFocused || cardsFocusInProgressRef.current || scrollSnapPending) return;
            // Не снэпать если выходим к родителю или уже вышли
            if (exitToParentInProgressRef.current || returnedToSliderRef.current) return;
            // Не снэпать сразу после выхода из карточек
            if (recentlyExitedCardsRef.current) return;

            const timelineEl = timelineWrapperRef.current;
            const cardsEl = historyListRef.current;
            const sectionEl = sectionRef.current;
            if (!timelineEl || !cardsEl || !sectionEl) return;

            const sectionRect = sectionEl.getBoundingClientRect();
            if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) {
                lastLineY = null;
                return;
            }

            const timelineRect = timelineEl.getBoundingClientRect();
            const lineY = timelineRect.top + timelineRect.height / 2;
            const centerY = window.innerHeight / 2;
            const snapZone = 150; // Зона snap вокруг центра

            // Определяем направление скролла
            const wasAbove = lastLineY !== null && lastLineY > centerY;
            const wasBelow = lastLineY !== null && lastLineY < centerY;
            const isNearCenter = lineY > centerY - snapZone && lineY < centerY + snapZone;

            // Если линия пересекла центр или находится в зоне snap
            if (isNearCenter) {
                const crossedDown = wasAbove && lineY <= centerY;
                const crossedUp = wasBelow && lineY >= centerY;

                if (crossedDown || crossedUp || Math.abs(lineY - centerY) < 50) {
                    scrollSnapPending = true;

                    // Определяем направление входа
                    const isFromBottom = wasBelow || lineY > centerY;

                    requestAnimationFrame(() => {
                        activateCardsFocus(timelineEl, cardsEl, sectionEl, isFromBottom);
                        scrollSnapPending = false;
                    });
                }
            }

            lastLineY = lineY;
        };

        window.addEventListener('wheel', handleWheelSnapToCards, { passive: false });
        window.addEventListener('scroll', handleScrollSnap, { passive: true });
        return () => {
            window.removeEventListener('wheel', handleWheelSnapToCards);
            window.removeEventListener('scroll', handleScrollSnap);
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

            console.log('[EXIT_UP]', {
                isInHeader,
                isIntroActive,
                exitToParentInProgress: exitToParentInProgressRef.current,
                cardsFocused,
                headerTop: headerRect.top,
                headerBottom: headerRect.bottom
            });

            // Если header не виден и он выше viewport - скроллим к нему
            if (!isInHeader) {
                if (headerRect.top < 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

                    const sectionEl = sectionRef.current;
                    if (sectionEl) {
                        const sectionRect = sectionEl.getBoundingClientRect();
                        const targetScroll = window.pageYOffset + sectionRect.top;
                        window.scrollTo({
                            top: targetScroll,
                            behavior: 'smooth'
                        });
                    }
                }
                return;
            }

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
            // Не входить в карточки сразу после выхода из них
            if (recentlyExitedCardsRef.current) return;

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

            console.log('[DOWN]', {
                isInHeader,
                textAnimationReady: textAnimationReady.current,
                headerIntroInProgress: headerIntroInProgressRef.current,
                hasScrollToCardsTriggered: hasScrollToCardsTriggered.current,
                cardsFocused,
                triggerY,
                headerTop: headerRect.top,
                headerBottom: headerRect.bottom
            });

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
            cardsEl.style.padding = '0';
            cardsEl.style.top = '0';
            cardsEl.style.height = '100vh';
            cardsEl.style.display = 'block';
            cardsEl.style.boxSizing = 'border-box';

            // overflow: visible для карточек (центрирование через CSS Grid)
            cardsEl.style.overflow = 'visible';
            cardsEl.style.overscrollBehavior = 'contain';

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

                    // Линия центрируется через CSS Grid (50vh), контейнер должен быть вверху
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

        // Вычисляем offset при котором последняя карточка станет полностью видима
        const getMaxOffset = () => {
            const lastCard = getLastCard();
            if (!lastCard) return 0;

            const rect = lastCard.getBoundingClientRect();
            // Правый край карточки + текущий offset = абсолютная позиция
            const cardRightX = rect.right + getCurrentOffset();
            // Offset при котором правый край будет у правого края экрана (с отступом)
            return Math.max(0, cardRightX - window.innerWidth + MARGIN);
        };

        // Проверяем что последняя карточка полностью видима на экране
        const isLastCardFullyVisible = () => {
            const lastCard = getLastCard();
            if (!lastCard) return true;

            const rect = lastCard.getBoundingClientRect();
            // Правый край карточки должен быть внутри viewport (с небольшим отступом)
            return rect.right <= window.innerWidth - MARGIN;
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
                const fullyVisible = isLastCardFullyVisible();

                // Когда последняя карточка полностью видима - продолжаем вертикальный скролл
                if (fullyVisible) {
                    // Не блокируем event - позволяем странице скроллиться
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

                // Когда offset = 0 - вызываем exitCardsFocus (карточки опускаются, появляется текст)
                if (currentOffset <= 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

                    const cardsEl = historyListRef.current;
                    if (cardsEl) {
                        // Блокируем повторный snap на 2 секунды после выхода
                        recentlyExitedCardsRef.current = true;
                        setTimeout(() => {
                            recentlyExitedCardsRef.current = false;
                        }, 2000);

                        exitCardsFocus(cardsEl);
                    }
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
    }, [cardsFocused, timelineWrapperRef, cardsFocusInProgressRef, historyListRef, exitCardsFocus]);
}