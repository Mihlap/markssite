import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import styles from './CompanyHistory.module.scss';
import headerStyles from './CompanyHistoryHeader.module.scss';
import { fetchCompanyHistory } from '../../store/Slice/companyHistorySlice';
import cityVector from '../icons/cityVector.svg';
import HistoryCard from './HistoryCard';
import CompanyHistoryHeader from './CompanyHistoryHeader';
import { useCompanyHistoryHeaderIntro } from '../utils/useCompanyHistoryHeaderIntro';

gsap.registerPlugin(ScrollToPlugin);

export default function CompanyHistory({ parentStartRef, externalHistoryHeaderRef }) {
    const dispatch = useDispatch();
    const historyItems = useSelector((state) => state.companyHistory.items || []);
    const loading = useSelector((state) => state.companyHistory.loading);

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const subtitleLineRef = useRef(null);
    const marksGroupRef = useRef(null);
    const subtitleLine1Ref = useRef(null);
    const subtitleLine2Ref = useRef(null);
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

    const [animationReady, setAnimationReady] = useState(false);
    const [cardsFocused, setCardsFocused] = useState(false);
    const cardsFocusInProgressRef = useRef(false);
    const exitToParentInProgressRef = useRef(false);

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    const visibleItems = useMemo(
        () =>
            [...historyItems]
                .filter((item) => !item.hidden)
                .sort((a, b) => {
                    const ao = a.order ?? 0;
                    const bo = b.order ?? 0;
                    if (ao !== bo) return ao - bo;
                    return (b.year ?? 0) - (a.year ?? 0);
                }),
        [historyItems]
    );

    const { timelineItems, cardsByYear } = useMemo(() => {
        const uniqueYears = [...new Set(visibleItems.map((item) => item.year))].sort((a, b) => a - b);

        const grouped = {};
        uniqueYears.forEach((year) => {
            grouped[year] = {
                top: [],
                bottom: [],
            };
        });

        visibleItems.forEach((item, index) => {
            const year = item.year;
            if (!grouped[year]) return;
            if (index % 2 === 0) grouped[year].top.push(item);
            else grouped[year].bottom.push(item);
        });

        return { timelineItems: uniqueYears, cardsByYear: grouped };
    }, [visibleItems]);

    useEffect(() => {
        dispatch(fetchCompanyHistory());
    }, [dispatch]);

    useCompanyHistoryHeaderIntro({
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
    });

    // wheel up: return from cards focus to header
    useEffect(() => {
        if (!inView) return;

        const handleWheelUp = (e) => {
            if (e.deltaY >= 0) return;

            const cardsEl = historyListRef.current;
            const timelineEl = timelineWrapperRef.current;
            if (!cardsEl) return;

            if (!cardsFocused || cardsFocusInProgressRef.current) return;

            // If the focused container can scroll vertically, let wheel-up scroll it first.
            // Exit focus only when we're at the very top.
            const hasVerticalOverflow = cardsEl.scrollHeight > cardsEl.clientHeight + 1;
            if (hasVerticalOverflow && cardsEl.scrollTop > 1) return;

            const canScrollLeft = timelineEl && timelineEl.scrollLeft > 1;
            if (canScrollLeft) return;

            e.preventDefault();
            e.stopPropagation();

            cardsFocusInProgressRef.current = true;
            hasScrollToHeaderTriggered.current = true;
            hasScrollToCardsTriggered.current = false;

            if (historyTagRef.current) {
                gsap.to(historyTagRef.current, { opacity: 0, duration: 0.2 });
            }

            gsap.to(cardsEl, {
                y: 0,
                duration: 1.0,
                ease: 'power2.inOut',
                onComplete: () => {
                    cardsFocusInProgressRef.current = false;
                    setCardsFocused(false);
                    hasScrollToHeaderTriggered.current = false;
                    // re-arm header intro so it can replay when we return from cards focus
                    headerIntroArmedRef.current = true;

                    // restore header animation positioning
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

                    // force header intro hook to re-evaluate "in header" and replay animation
                    requestAnimationFrame(() => {
                        window.dispatchEvent(new Event('scroll'));
                    });
                },
            });
        };

        window.addEventListener('wheel', handleWheelUp, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelUp);
    }, [inView, cardsFocused, animationReady]);

    // wheel up in header: split text + scroll focus to parent start
    useEffect(() => {
        if (!inView) return;

        const handleWheelExitUp = (e) => {
            if (e.deltaY >= 0) return;
            if (cardsFocused || cardsFocusInProgressRef.current) return;
            // Пока идёт "выход наверх", любые новые wheel-события (особенно на тачпаде с инерцией)
            // могут перебивать scrollTo и визуально создавать ощущение "фокус не переезжает".
            // Поэтому во время выхода жёстко гасим wheel.
            if (exitToParentInProgressRef.current) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                return;
            }

            const headerEl = historyHeaderRef.current;
            if (!headerEl) return;

            // Проверяем, идет ли интро ДО проверки "в хедере", чтобы сделать проверку более мягкой
            const isIntroActive = headerIntroInProgressRef.current || !textAnimationReady.current;

            // Deterministic "in header" check:
            // - prefer pointer position (where the user is actually scrolling)
            // - fallback to a stable point in viewport
            // - during intro: be more lenient - allow if header is visible in viewport
            // We intentionally DO NOT exclude cardsRect because cards overlap the header by design.
            const headerRect = headerEl.getBoundingClientRect();
            const pointerY = Number.isFinite(e.clientY) ? e.clientY : null;
            const triggerY = window.innerHeight * 0.25;
            const probeY = pointerY ?? triggerY;

            // "В хедере" считаем если:
            // - курсор (куда реально крутят) находится в пределах хедера, ИЛИ
            // - хедер занимает контрольную точку вьюпорта (25% высоты), даже если курсор ниже/выше, ИЛИ
            // - во время интро: хедер виден в viewport (верхняя половина экрана)
            const isPointerInHeader = probeY >= headerRect.top && probeY <= headerRect.bottom;
            const isTriggerPointInHeader = triggerY >= headerRect.top && triggerY <= headerRect.bottom;
            // Во время интро делаем проверку более мягкой - если хедер виден в верхней половине экрана
            const isHeaderVisibleDuringIntro = isIntroActive && headerRect.top < window.innerHeight * 0.6 && headerRect.bottom > 0;
            const isInHeader = isPointerInHeader || isTriggerPointInHeader || isHeaderVisibleDuringIntro;
            if (!isInHeader) return;

            // Прерываем интро сразу при wheel up - останавливаем все анимации
            if (isIntroActive) {
                headerIntroInProgressRef.current = false;
                textAnimationReady.current = true;
            }

            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

            // kill competing scroll tweens so every wheel-up always results in a scroll
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

            // Агрессивно останавливаем все анимации элементов
            const elements = [marksGroup, title, subtitleLine, descLine1, descLine2];
            elements.forEach((el) => {
                if (!el) return;
                // Убиваем все GSAP-твины элемента
                gsap.killTweensOf(el);
                // Получаем текущие computed значения для плавного перехода
                const computedStyle = window.getComputedStyle(el);
                const currentX = gsap.getProperty(el, 'x') || 0;
                const currentOpacity = parseFloat(computedStyle.opacity) || 1;
                // Фиксируем текущее состояние
                gsap.set(el, { x: currentX, opacity: currentOpacity, clearProps: '' });
                // Останавливаем CSS-анимации
                el.classList.remove(headerStyles.animate);
                el.style.animation = 'none';
                el.style.animationPlayState = 'paused';
                // Принудительно останавливаем все CSS transitions
                el.style.transition = 'none';
            });

            const targetEl = parentStartRef?.current ?? null;
            const targetY = targetEl ? targetEl.getBoundingClientRect().top + window.pageYOffset : 0;
            const startY = window.pageYOffset || document.documentElement.scrollTop || 0;
            const y = Math.max(0, Number.isFinite(targetY) ? targetY : 0);

            // Используем сохраненное значение isIntroActive вместо пересчета
            const isDuringIntro = isIntroActive;

            const tl = gsap.timeline({
                defaults: { ease: 'power2.in', force3D: true, overwrite: 'auto' },
                onComplete: () => {
                    // чтобы интро могло корректно вычислять оффсеты при следующем заходе
                    hasSplitTriggered.current = false;
                    headerIntroArmedRef.current = true;
                    hasScrollToHeaderTriggered.current = false;
                    exitToParentInProgressRef.current = false;
                },
            });

            // Всегда добавляем плавный scrollTo в timeline для плавности.
            // Если интро было прервано, используем более быстрый scroll для более отзывчивого ощущения.
            const scrollDuration = isDuringIntro ? 0.7 : 0.85;
            tl.to(
                window,
                {
                    duration: scrollDuration,
                    ease: 'power2.inOut',
                    overwrite: 'auto',
                    scrollTo: { y: targetEl ?? y, autoKill: false },
                },
                0
            );

            // Fallback для прерванного интро: если GSAP scrollTo не сработает быстро, делаем native smooth scroll.
            // Используем более короткий таймаут для прерванного интро
            const fallbackDelay = isDuringIntro ? 80 : 120;
            const fallbackTimer = window.setTimeout(() => {
                const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
                // Если скролл вообще не сдвинулся от стартовой позиции (GSAP не стартовал), делаем native smooth scroll.
                const moved = Math.abs(currentY - startY) > 2;
                if (!moved) {
                    try {
                        if (targetEl) {
                            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            window.scrollTo({ top: y, left: 0, behavior: 'smooth' });
                        }
                    } catch (err) {
                        if (targetEl) {
                            targetEl.scrollIntoView();
                        } else {
                            window.scrollTo(0, y);
                        }
                    }
                }
            }, fallbackDelay);

            // Очищаем fallback в onComplete.
            const originalOnComplete = tl.eventCallback('onComplete');
            tl.eventCallback('onComplete', () => {
                window.clearTimeout(fallbackTimer);
                if (originalOnComplete) originalOnComplete();
            });

            tl.fromTo(
                marksGroup,
                { x: gsap.getProperty(marksGroup, 'x') || 0, opacity: gsap.getProperty(marksGroup, 'opacity') || 1 },
                { x: '-100vw', opacity: 0, duration: 0.6 },
                0
            );

            [title, subtitleLine, descLine1, descLine2].filter(Boolean).forEach((el) => {
                tl.fromTo(
                    el,
                    { x: gsap.getProperty(el, 'x') || 0, opacity: gsap.getProperty(el, 'opacity') || 1 },
                    { x: '100vw', opacity: 0, duration: 0.6 },
                    0
                );
            });
        };

        window.addEventListener('wheel', handleWheelExitUp, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelExitUp);
    }, [inView, cardsFocused, historyHeaderRef, externalHistoryHeaderRef, parentStartRef]);

    // wheel down in header: split text + focus cards (cards rise to 100vh)
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
            // Обязательно дожидаемся окончания анимации текста перед всплытием карточек
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

            // Создаём timeline для синхронизации анимаций: разъезжание текста + подъём карточек + появление таба
            const tl = gsap.timeline();

            // Анимация разъезжания текста
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

            // Фиксируем позицию ДО включения `.cards_focus` для компенсации layout-jump
            const rectBefore = cardsEl.getBoundingClientRect();
            const topBefore = rectBefore.top;

            // Принудительно создаём новый слой композиции для предотвращения визуального скачка
            cardsEl.style.willChange = 'transform';
            cardsEl.style.transform = 'translateZ(0)';

            // Скрываем контейнер во время layout reflow, чтобы не было видимого скачка
            cardsEl.style.opacity = '0';
            cardsEl.style.pointerEvents = 'none';
            cardsEl.style.visibility = 'hidden';

            // Сбрасываем transform перед включением `.cards_focus`
            gsap.set(cardsEl, { y: 0, clearProps: 'transform' });
            cardsFocusInProgressRef.current = true;

            // Включаем `.cards_focus` синхронно через flushSync, чтобы layout применился сразу
            flushSync(() => {
                setCardsFocused(true);
            });

            // Синхронно измеряем layout jump сразу после flushSync (без ожидания RAF)
            // Это критично для точной компенсации
            const rectAfter = cardsEl.getBoundingClientRect();
            const topAfter = rectAfter.top;
            const layoutJump = topAfter - topBefore;

            // Мгновенно компенсируем layout-jump через transform ДО показа контейнера
            // Используем прямое присваивание style.transform для максимальной синхронности
            if (Math.abs(layoutJump) > 0.5) {
                cardsEl.style.transform = `translateZ(0) translateY(${-layoutJump}px)`;
                // Также устанавливаем через GSAP для совместимости с анимацией
                gsap.set(cardsEl, {
                    y: -layoutJump,
                    immediateRender: true,
                    force3D: true,
                });
            }

            // Показываем контейнер после компенсации
            cardsEl.style.opacity = '';
            cardsEl.style.pointerEvents = '';
            cardsEl.style.visibility = '';

            // Ждём один frame для гарантии, что компенсация применена и отрисована
            requestAnimationFrame(() => {
                // Вычисляем финальный shiftY для подъёма от компенсированной позиции
                const rectFinal = cardsEl.getBoundingClientRect();
                const rawShiftY = -rectFinal.top;

                // Ограничиваем shiftY, чтобы тег "История MARKS GROUP" не заходил под слайдер бегущей строки
                const sliderHeight = 42;
                const tagTopOffset = 24;
                const minSafeTop = sliderHeight + tagTopOffset + 6;
                const safeTop = Math.max(minSafeTop, Math.min(120, window.innerHeight * 0.1));

                const minShiftY = safeTop - rectFinal.top;
                const shiftY = Math.max(rawShiftY, minShiftY);

                // Плавный подъём карточек синхронизирован с разъезжанием текста
                // Начинаем от текущего y (уже компенсированного)
                const currentY = gsap.getProperty(cardsEl, 'y') || 0;
                tl.to(
                    cardsEl,
                    {
                        y: currentY + shiftY,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            cardsFocusInProgressRef.current = false;
                            // Убираем will-change после анимации для оптимизации
                            cardsEl.style.willChange = '';
                        },
                    },
                    0.1 // Небольшая задержка после начала разъезжания текста
                );
            });
        };

        window.addEventListener('wheel', handleWheelDown, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelDown);
    }, [inView, cardsFocused, historyHeaderRef]);

    // vertical wheel drives horizontal scroll when cards are centered
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
            // When cards are focused we should never allow vertical page scrolling.
            // If we're not in the "center zone" we still preventDefault (but don't stopPropagation)
            // so other wheel handlers (exit focus) can receive the event.
            if (!isInCenter) {
                const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX || 0);
                // If the focused container can scroll vertically, allow that scrolling.
                if (cardsFocused && isVerticalScroll && Math.abs(e.deltaY) > 5 && !hasVerticalOverflow) {
                    e.preventDefault();
                }
                return;
            }

            const { deltaY } = e;
            const isVerticalScroll = Math.abs(deltaY) > Math.abs(e.deltaX || 0);
            if (!isVerticalScroll || Math.abs(deltaY) <= 5) return;

            // If content doesn't fit vertically in focus mode, prioritize vertical scroll.
            // Horizontal scrolling still works via trackpad horizontal, scrollbar, or Shift+wheel.
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
    }, [inView, cardsFocused]);

    return (
        <div id="history" ref={ref} className={`${styles.history_section} ${cardsFocused ? styles.cards_focus : ''}`}>
            <div className={styles.history_content}>
                <CompanyHistoryHeader
                    historyHeaderRef={historyHeaderRef}
                    titleRef={titleRef}
                    subtitleRef={subtitleRef}
                    marksGroupRef={marksGroupRef}
                    subtitleLineRef={subtitleLineRef}
                    subtitleLine1Ref={subtitleLine1Ref}
                    subtitleLine2Ref={subtitleLine2Ref}
                    cityVector={cityVector}
                />

                {loading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : visibleItems.length > 0 ? (
                    <div ref={historyListRef} className={styles.history_timeline_container}>
                        <div ref={historyTagRef} className={styles.history_tag}>
                            История MARKS GROUP
                        </div>
                        <div ref={timelineWrapperRef} className={styles.timeline_wrapper}>
                            <div className={styles.cards_row_top}>
                                {timelineItems.map((year) => (
                                    <div key={`top-${year}`} className={styles.year_cards_group} data-year={year}>
                                        {cardsByYear[year]?.top.map((item) => (
                                            <div key={item.id} className={styles.history_card_wrapper}>
                                                <HistoryCard item={item} variant={item.img ? 1 : 2} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.timeline}>
                                <div className={styles.timeline_line}></div>
                                <div className={styles.timeline_years}>
                                    {timelineItems.map((year) => (
                                        <div key={year} className={styles.timeline_year_marker} data-year={year}>
                                            <div className={styles.year_dot}></div>
                                            <div className={styles.year_label}>{year}</div>
                                            {cardsByYear[year]?.top.length > 0 && (
                                                <div className={`${styles.year_connector} ${styles.connector_top}`}></div>
                                            )}
                                            {cardsByYear[year]?.bottom.length > 0 && (
                                                <div className={`${styles.year_connector} ${styles.connector_bottom}`}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.cards_row_bottom}>
                                {timelineItems.map((year) => (
                                    <div key={`bottom-${year}`} className={styles.year_cards_group} data-year={year}>
                                        {cardsByYear[year]?.bottom.map((item) => (
                                            <div key={item.id} className={styles.history_card_wrapper}>
                                                <HistoryCard item={item} variant={item.img ? 1 : 2} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.empty_history}>История компании обновляется</div>
                )}
            </div>
        </div>
    );
}


