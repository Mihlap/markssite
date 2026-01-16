import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

/**
 * Компонент истории компании
 * Управляет отображением карточек истории, анимациями при скролле и переходами между состояниями
 * @param {Object} parentStartRef - ссылка на элемент родительского компонента для навигации
 * @param {Object} sliderRef - ссылка на слайдер, который должен быть виден при скролле вверх
 * @param {Object} externalHistoryHeaderRef - внешняя ссылка на хедер истории (опционально)
 */
export default function CompanyHistory({ parentStartRef, sliderRef, externalHistoryHeaderRef }) {
    const dispatch = useDispatch();
    const historyItems = useSelector((state) => state.companyHistory.items || []);
    const loading = useSelector((state) => state.companyHistory.loading);

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const subtitleLineRef = useRef(null);
    const marksGroupRef = useRef(null);
    const subtitleLine1Ref = useRef(null);
    const subtitleLine2Ref = useRef(null);
    const backgroundRef = useRef(null);
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
    const returnedToSliderRef = useRef(false);

    const [animationReady, setAnimationReady] = useState(false);
    const [cardsFocused, setCardsFocused] = useState(false);
    const cardsFocusInProgressRef = useRef(false);
    const exitToParentInProgressRef = useRef(false);

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    /**
     * Фильтрует и сортирует видимые элементы истории
     * Скрывает элементы с флагом hidden и сортирует по порядку, затем по году
     */
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

    /**
     * Группирует карточки по годам и распределяет их между верхним и нижним рядом
     * Четные индексы идут в верхний ряд, нечетные - в нижний
     */
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

    /**
     * Загружает данные истории компании при монтировании компонента
     */
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
                    // Перезаряжаем интро хедера, чтобы оно могло проиграться при возврате из фокуса карточек
                    headerIntroArmedRef.current = true;

                    // Восстанавливаем позиционирование анимации хедера
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

                    // Принудительно заставляем хук интро хедера переоценить "в хедере" и переиграть анимацию
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
        [animationReady]
    );

    /**
     * Обработчик скролла вверх: возврат от фокуса карточек к хедеру
     * Срабатывает когда пользователь скроллит вверх в режиме фокуса карточек
     */
    useEffect(() => {
        if (!inView) return;

        const handleWheelUp = (e) => {
            if (e.deltaY >= 0) return;

            const cardsEl = historyListRef.current;
            const timelineEl = timelineWrapperRef.current;
            if (!cardsEl) return;

            if (!cardsFocused || cardsFocusInProgressRef.current) return;

            // Если контейнер может скроллиться вертикально, сначала прокручиваем его
            // Выходим из фокуса только когда мы в самом верху
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
    }, [inView, cardsFocused, exitCardsFocus]);

    /**
     * Обработчик скролла вниз: выход из фокуса карточек в следующую секцию
     * Срабатывает когда пользователь скроллит вниз и больше нечего скроллить внутри таймлайна/контейнера
     */
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
    }, [inView, cardsFocused, exitCardsFocus]);

    /**
     * Обработчик скролла вверх в хедере: разъезжание текста и скролл к началу родительского компонента
     * Срабатывает когда пользователь скроллит вверх находясь в области хедера
     */
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

            // Детерминированная проверка "в хедере":
            // - предпочитаем позицию курсора (где пользователь реально скроллит)
            // - запасной вариант на стабильную точку в области просмотра
            // - во время интро: более мягкая проверка - разрешаем если хедер виден в области просмотра
            // Намеренно НЕ исключаем cardsRect, так как карточки по дизайну перекрывают хедер
            const headerRect = headerEl.getBoundingClientRect();
            const pointerY = Number.isFinite(e.clientY) ? e.clientY : null;
            const triggerY = window.innerHeight * 0.25;
            const probeY = pointerY ?? triggerY;

            // "В хедере" считаем если:
            // - курсор (куда реально крутят) находится в пределах хедера, ИЛИ
            // - хедер занимает контрольную точку вьюпорта (25% высоты), даже если курсор ниже/выше, ИЛИ
            // - во время интро: хедер виден в области просмотра (верхняя половина экрана)
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

            // Убиваем конкурирующие scroll-твины, чтобы каждое wheel-up всегда приводило к скроллу
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

            const startY = window.pageYOffset || document.documentElement.scrollTop || 0;

            // Вычисляем позицию так, чтобы слайдер был внизу видимой части экрана
            const sliderEl = sliderRef?.current;
            let y = 0;

            if (sliderEl) {
                const sliderRect = sliderEl.getBoundingClientRect();
                const sliderAbsoluteBottom = sliderRect.bottom + window.pageYOffset;
                // Позиционируем так, чтобы низ слайдера был у низа экрана (с небольшим отступом)
                const bottomOffset = 60;
                y = Math.max(0, sliderAbsoluteBottom - window.innerHeight + bottomOffset);
            } else {
                // Fallback: скроллим к самому верху
                y = 0;
            }

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
                    // Сбрасываем флаги для перезапуска анимации интро при скролле вниз
                    textAnimationReady.current = false;
                    returnedToSliderRef.current = true;
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
                    scrollTo: { y, autoKill: false },
                },
                0
            );

            // Запасной вариант для прерванного интро: если GSAP scrollTo не сработает быстро, делаем нативный плавный скролл
            // Используем более короткий таймаут для прерванного интро
            const fallbackDelay = isDuringIntro ? 80 : 120;
            const fallbackTimer = window.setTimeout(() => {
                const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
                // Если скролл вообще не сдвинулся от стартовой позиции (GSAP не стартовал), делаем нативный плавный скролл
                const moved = Math.abs(currentY - startY) > 2;
                if (!moved) {
                    try {
                        window.scrollTo({ top: y, left: 0, behavior: 'smooth' });
                    } catch (err) {
                        window.scrollTo(0, y);
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
    }, [inView, cardsFocused, historyHeaderRef, externalHistoryHeaderRef, parentStartRef, sliderRef]);

    /**
     * Обработчик скролла вниз от слайдера: плавный переход к центру хедера с перезапуском интро-анимации
     * Срабатывает после возврата к слайдеру при скролле вверх
     */
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

            // Проверяем, что слайдер находится в нижней части экрана (позиция после возврата)
            const isSliderVisible = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;
            if (!isSliderVisible) return;

            e.preventDefault();
            e.stopPropagation();

            returnedToSliderRef.current = false;

            // Плавно скроллим так, чтобы слайдер ушел за пределы экрана
            // и был виден только хедер истории с анимацией текста
            const headerRect = headerEl.getBoundingClientRect();
            const headerAbsoluteTop = headerRect.top + window.pageYOffset;
            // Небольшой отступ сверху для хедера
            const topOffset = 40;
            const targetY = Math.max(0, headerAbsoluteTop - topOffset);

            gsap.to(window, {
                duration: 0.8,
                ease: 'power2.inOut',
                scrollTo: { y: targetY, autoKill: false },
            });
        };

        window.addEventListener('wheel', handleWheelFromSlider, { passive: false });
        return () => window.removeEventListener('wheel', handleWheelFromSlider);
    }, [inView, cardsFocused, sliderRef, historyHeaderRef]);

    /**
     * Обработчик скролла вниз в хедере: разъезжание текста и фокус на карточках (карточки поднимаются на 100vh)
     * Срабатывает когда пользователь скроллит вниз находясь в области хедера
     */
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

            // Фиксируем позицию ДО включения `.cards_focus` для компенсации скачка макета
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

            // Синхронно измеряем скачок макета сразу после flushSync (без ожидания requestAnimationFrame)
            // Это критично для точной компенсации
            const rectAfter = cardsEl.getBoundingClientRect();
            const topAfter = rectAfter.top;
            const layoutJump = topAfter - topBefore;

            // Мгновенно компенсируем скачок макета через transform ДО показа контейнера
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

                // Ограничиваем shiftY так, чтобы карточки не заходили под тег истории
                let safeTop = Math.min(120, window.innerHeight * 0.1);
                const tagEl = historyTagRef.current;
                if (tagEl) {
                    const tagRect = tagEl.getBoundingClientRect();
                    const cardsStyles = window.getComputedStyle(cardsEl);
                    const paddingTop = parseFloat(cardsStyles.paddingTop) || 0;
                    const gap = 12;
                    safeTop = tagRect.bottom + gap - paddingTop;
                }

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

    /**
     * Обработчик вертикального скролла для горизонтального скролла таймлайна когда карточки в центре
     * Преобразует вертикальные движения колесика мыши в горизонтальный скролл таймлайна
     */
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
            // Когда карточки в фокусе, мы никогда не должны разрешать вертикальный скролл страницы
            // Если мы не в "центральной зоне", все равно делаем preventDefault (но не stopPropagation)
            // чтобы другие обработчики wheel (выход из фокуса) могли получить событие
            if (!isInCenter) {
                const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX || 0);
                // Если контейнер в фокусе может скроллиться вертикально, разрешаем этот скролл
                if (cardsFocused && isVerticalScroll && Math.abs(e.deltaY) > 5 && !hasVerticalOverflow) {
                    e.preventDefault();
                }
                return;
            }

            const { deltaY } = e;
            const isVerticalScroll = Math.abs(deltaY) > Math.abs(e.deltaX || 0);
            if (!isVerticalScroll || Math.abs(deltaY) <= 5) return;

            // Если контент не помещается вертикально в режиме фокуса, приоритет вертикальному скроллу
            // Горизонтальный скролл все еще работает через горизонтальный тачпад, скроллбар или Shift+wheel
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
                    backgroundRef={backgroundRef}
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


