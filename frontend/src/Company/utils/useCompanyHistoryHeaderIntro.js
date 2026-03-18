import { useEffect } from 'react';
import gsap from 'gsap';
import styles from '../CompanyHistory/HistoryTimeline.module.scss';
import headerStyles from '../CompanyHistory/CompanyHistoryHeader.module.scss';

export function useCompanyHistoryHeaderIntro({
    isDesktop = true,
    inView,
    visibleItemsLength,
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
    cardsFocused,
}) {
    useEffect(() => {
        if (!inView || !isDesktop) return;

        const applyOffsetsForIntro = () => {
            if (headerIntroInProgressRef.current) return;
            if (hasSplitTriggered.current) return;
            if (!marksGroupRef.current || !titleRef.current || !subtitleLine1Ref.current) return;

            const elements = [
                titleRef.current,
                marksGroupRef.current,
                subtitleLineRef.current,
                subtitleLine1Ref.current,
                subtitleLine2Ref.current,
            ];

            elements.forEach((el) => {
                if (!el) return;
                el.style.transform = 'none';
            });

            const titleRect = titleRef.current.getBoundingClientRect();
            const marksRect = marksGroupRef.current.getBoundingClientRect();
            const titleNaturalCenterX = titleRect.left + titleRect.width / 2;

            let titleTargetCenterX;
            if (window.innerWidth >= 1600) {
                titleTargetCenterX = marksRect.left + marksRect.width / 2;
            } else {
                titleTargetCenterX = marksRect.right - titleRect.width / 2;
            }
            const titleOffsetX = titleTargetCenterX - titleNaturalCenterX;

            const line1Rect = subtitleLine1Ref.current.getBoundingClientRect();
            const lineNaturalLeft = line1Rect.left;

            let descTargetLeft;
            if (window.innerWidth >= 1600) {
                descTargetLeft = marksRect.left + marksRect.width / 2;
            } else {
                descTargetLeft = marksRect.left + marksRect.width * 0.65;
            }
            const descOffsetX = descTargetLeft - lineNaturalLeft;

            document.documentElement.style.setProperty('--title-offset-x', `${titleOffsetX}px`);
            document.documentElement.style.setProperty('--desc-offset-x', `${descOffsetX}px`);

            elements.forEach((el) => {
                if (!el) return;
                el.style.transform = '';
            });
        };

        const handleResize = () => {
            applyOffsetsForIntro();
        };

        applyOffsetsForIntro();
        const rafId = requestAnimationFrame(applyOffsetsForIntro);

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
        };
    }, [
        inView,
        isDesktop,
        hasSplitTriggered,
        headerIntroInProgressRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
    ]);

    useEffect(() => {
        if (isDesktop) return;
        const headerEl = historyHeaderRef?.current;
        const title = titleRef?.current;
        const marksGroup = marksGroupRef?.current;
        const subtitleLine = subtitleLineRef?.current;
        const descLine1 = subtitleLine1Ref?.current;
        const descLine2 = subtitleLine2Ref?.current;
        if (!headerEl || !title) return;

        const elements = [title, marksGroup, subtitleLine, descLine1, descLine2].filter(Boolean);
        const io = new IntersectionObserver(
            (entries) => {
                const [e] = entries;
                if (!e || e.isIntersecting) return;
                const rect = headerEl.getBoundingClientRect();
                if (rect.bottom >= 0) return;
                elements.forEach((el) => {
                    if (!el) return;
                    gsap.killTweensOf(el);
                    gsap.to(el, {
                        x: '-100vw',
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.in',
                        overwrite: true,
                    });
                });
            },
            { root: null, rootMargin: '0px', threshold: 0 }
        );
        io.observe(headerEl);
        return () => io.disconnect();
    }, [isDesktop, historyHeaderRef, titleRef, marksGroupRef, subtitleLineRef, subtitleLine1Ref, subtitleLine2Ref]);

    useEffect(() => {
        if (inView) {
            textAnimationReady.current = true;
        }

        if (!inView) return;

        const startHeaderIntro = () => {
            if (headerIntroInProgressRef.current) return;

            const title = titleRef.current;
            const marksGroup = marksGroupRef.current;
            const subtitleLine = subtitleLineRef.current;
            const descLine1 = subtitleLine1Ref.current;
            const descLine2 = subtitleLine2Ref.current;
            if (!title || !marksGroup || !descLine1) return;

            const elements = [title, marksGroup, subtitleLine, descLine1, descLine2].filter(Boolean);
            elements.forEach((el) => {
                gsap.set(el, { clearProps: 'transform,opacity' });
                el.classList.remove(headerStyles.animate);
                el.style.animation = '';
                el.style.opacity = '';
                el.style.transform = '';
            });

            void title.offsetWidth;

            textAnimationReady.current = true;
            headerIntroInProgressRef.current = false;

            requestAnimationFrame(() => {
                if (titleRef.current) titleRef.current.classList.add(headerStyles.animate);
                if (marksGroupRef.current) marksGroupRef.current.classList.add(headerStyles.animate);
                if (subtitleLineRef.current) subtitleLineRef.current.classList.add(headerStyles.animate);
                if (subtitleLine1Ref.current) subtitleLine1Ref.current.classList.add(headerStyles.animate);
                if (subtitleLine2Ref.current) subtitleLine2Ref.current.classList.add(headerStyles.animate);
            });

            if (!cardsIntroTriggeredRef.current) {
                const cards = historyListRef.current?.querySelectorAll('[class*="history_card_wrapper"]');
                if (cards && cards.length > 0) {
                    cardsIntroTriggeredRef.current = true;

                    cards.forEach((card) => {
                        card.classList.add(styles.animate);
                    });

                    setTimeout(() => {
                        setAnimationReady(true);
                    }, 800);
                }
            }
        };

        const onScroll = () => {
            // На мобильных/планшетах, когда карточки в фокусе по центру,
            // не даём этому хуку перезапускать анимацию заголовка.
            if (!isDesktop && cardsFocused) return;
            const headerEl = historyHeaderRef.current;
            if (!headerEl) return;

            const triggerY = window.innerHeight * 0.25;
            const headerRect = headerEl.getBoundingClientRect();
            const cardsEl = historyListRef.current;
            const cardsRect = cardsEl ? cardsEl.getBoundingClientRect() : null;

            const isInHeader =
                triggerY >= headerRect.top &&
                triggerY <= headerRect.bottom &&
                (!cardsRect || !(triggerY >= cardsRect.top && triggerY <= cardsRect.bottom));

            const headerVisible = headerRect.top < window.innerHeight && headerRect.bottom > 0;
            const cardsNotOverlapping = !cardsRect || cardsRect.top > headerRect.bottom || cardsRect.bottom < headerRect.top;
            const isHeaderVisible = headerVisible && cardsNotOverlapping;

            const shouldRestoreAnimation = !hasScrollToHeaderTriggered.current && headerIntroArmedRef.current && isHeaderVisible && !headerIntroInProgressRef.current;
            if (!isInHeader && !shouldRestoreAnimation) {
                headerIntroArmedRef.current = true;
                return;
            }

            if (!headerIntroArmedRef.current && !shouldRestoreAnimation) return;

            headerIntroArmedRef.current = false;

            if ((isInHeader && !hasScrollToHeaderTriggered.current) || shouldRestoreAnimation) {
                startHeaderIntro();
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [
        inView,
        visibleItemsLength,
        historyListRef,
        historyHeaderRef,
        titleRef,
        marksGroupRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        hasScrollToHeaderTriggered,
        headerIntroArmedRef,
        headerIntroInProgressRef,
        cardsIntroTriggeredRef,
        textAnimationReady,
        setAnimationReady,
        isDesktop,
        cardsFocused,
    ]);

    useEffect(() => {
        if (!inView || cardsIntroTriggeredRef.current) return;
        if (visibleItemsLength === 0) return;

        const timer = setTimeout(() => {
            const cards = historyListRef.current?.querySelectorAll('[class*="history_card_wrapper"]');
            if (cards && cards.length > 0 && !cardsIntroTriggeredRef.current) {
                cardsIntroTriggeredRef.current = true;

                cards.forEach((card) => {
                    card.classList.add(styles.animate);
                });

                setTimeout(() => {
                    setAnimationReady(true);
                }, 800);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [inView, visibleItemsLength, historyListRef, cardsIntroTriggeredRef, setAnimationReady]);
}


