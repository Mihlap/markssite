import { useEffect } from 'react';
import gsap from 'gsap';

export function useCompanyHistoryMobileGestures({
    isDesktop,
    isModalOpen,
    cardsFocused,
    setCardsFocused,
    sectionRef,
    historyHeaderRef,
    historyListRef,
    marksGroupRef,
    titleRef,
    subtitleLineRef,
    subtitleLine1Ref,
    subtitleLine2Ref,
    cardsFocusInProgressRef,
    mobileReturnToHistoryArmedRef,
    lockMobileScroll,
    headerAnimateClass,
    onExitToParentTop,
}) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isDesktop) return;

        const root = sectionRef.current;
        if (!root) return;
        if (isModalOpen) return;

        let startY = 0;
        let startX = 0;
        let active = false;

        const isInsideModalOrControl = (t) => {
            if (!t || typeof t.closest !== 'function') return false;
            return !!t.closest('[class*="ReactModal"], [role="dialog"], button, a, input, textarea, select');
        };

        const restartHeaderAnimation = () => {
            const marksGroup = marksGroupRef.current;
            const title = titleRef.current;
            const subtitleLine = subtitleLineRef.current;
            const descLine1 = subtitleLine1Ref.current;
            const descLine2 = subtitleLine2Ref.current;

            const els = [title, marksGroup, subtitleLine, descLine1, descLine2].filter(Boolean);
            els.forEach((el) => {
                gsap.killTweensOf(el);
                gsap.set(el, { clearProps: 'transform,opacity' });
                if (headerAnimateClass) el.classList.remove(headerAnimateClass);
                el.style.animation = '';
                el.style.opacity = '';
                el.style.transform = '';
            });

            requestAnimationFrame(() => {
                if (title) void title.offsetWidth;
                if (title && headerAnimateClass) title.classList.add(headerAnimateClass);
                if (marksGroup && headerAnimateClass) marksGroup.classList.add(headerAnimateClass);
                if (subtitleLine && headerAnimateClass) subtitleLine.classList.add(headerAnimateClass);
                if (descLine1 && headerAnimateClass) descLine1.classList.add(headerAnimateClass);
                if (descLine2 && headerAnimateClass) descLine2.classList.add(headerAnimateClass);
            });
        };

        const scrollToHistoryHeader = () => {
            const headerEl = historyHeaderRef.current;
            if (!headerEl) return;

            const headerTopAbs = headerEl.getBoundingClientRect().top + window.pageYOffset;
            const NAV_OFFSET_MOBILE = 70;
            const targetY = Math.max(0, headerTopAbs - NAV_OFFSET_MOBILE);
            const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;

            if (Math.abs(currentY - targetY) < 4) return;

            cardsFocusInProgressRef.current = true;
            setCardsFocused(false);
            root.removeAttribute('data-focus-layout');

            gsap.killTweensOf(window);
            gsap.to(window, {
                duration: 0.75,
                ease: 'power2.inOut',
                overwrite: 'auto',
                scrollTo: { y: targetY, autoKill: false },
                onComplete: () => {
                    cardsFocusInProgressRef.current = false;
                    restartHeaderAnimation();
                },
            });
        };

        const focusCardsCentered = () => {
            if (cardsFocused) return;
            if (cardsFocusInProgressRef.current) return;

            const cardsEl = historyListRef.current;
            if (!cardsEl) return;

            const lineEl =
                cardsEl.querySelector('[class*="timeline_line"]') || cardsEl.querySelector('[class*="timeline"]');

            const mobileSwiperWrapper = cardsEl.querySelector('[class*="history_mobile_swiper_wrapper"]');

            const focusTarget = !isDesktop ? mobileSwiperWrapper || cardsEl : lineEl;
            if (!focusTarget) return;

            const marksGroup = marksGroupRef.current;
            const title = titleRef.current;
            const subtitleLine = subtitleLineRef.current;
            const descLine1 = subtitleLine1Ref.current;
            const descLine2 = subtitleLine2Ref.current;

            const els = [marksGroup, title, subtitleLine, descLine1, descLine2].filter(Boolean);
            els.forEach((el) => {
                gsap.killTweensOf(el);
                const x = gsap.getProperty(el, 'x');
                const opacity = gsap.getProperty(el, 'opacity');
                gsap.set(el, { x, opacity, force3D: true });
                if (headerAnimateClass) el.classList.remove(headerAnimateClass);
                el.style.animation = 'none';
                el.style.transition = 'none';
            });

            const tl = gsap.timeline({ defaults: { overwrite: 'auto', force3D: true } });
            const TEXT_DUR = 0.55;
            tl.to(marksGroup, { x: '-100vw', opacity: 0, duration: TEXT_DUR, ease: 'power2.in' }, 0);
            [title, subtitleLine, descLine1, descLine2]
                .filter(Boolean)
                .forEach((el) => {
                    const exitX = isDesktop ? '100vw' : '-100vw';
                    tl.to(el, { x: exitX, opacity: 0, duration: TEXT_DUR, ease: 'power2.in' }, 0);
                });

            cardsFocusInProgressRef.current = true;
            setCardsFocused(true);
            root.setAttribute('data-focus-layout', 'ready');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    let targetY;

                    if (!isDesktop) {
                        const topbar = cardsEl.querySelector('[data-history-mobile-topbar="true"]');
                        if (topbar) {
                            const tbRect = topbar.getBoundingClientRect();
                            const tbTopAbs = tbRect.top + window.pageYOffset;
                            const SAFE_OFFSET_TOP = 70;
                            targetY = Math.max(0, tbTopAbs - SAFE_OFFSET_TOP);
                        }
                    }

                    if (typeof targetY !== 'number') {
                        const r = focusTarget.getBoundingClientRect();
                        const centerAbs = r.top + window.pageYOffset + r.height / 2;
                        targetY = Math.max(0, centerAbs - window.innerHeight / 2);
                    }

                    gsap.killTweensOf(window);
                    gsap.to(window, {
                        duration: 0.65,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        scrollTo: { y: targetY, autoKill: false },
                        onComplete: () => {
                            cardsFocusInProgressRef.current = false;
                            lockMobileScroll?.();
                        },
                    });
                });
            });
        };

        const onTouchStart = (e) => {
            if (isModalOpen) return;
            const t = e?.target;
            if (isInsideModalOrControl(t)) return;
            const touch = e.touches?.[0];
            if (!touch) return;
            startY = touch.clientY;
            startX = touch.clientX;
            active = true;
        };

        const onTouchEnd = (e) => {
            if (!active) return;
            active = false;
            if (isModalOpen) return;

            const touch = e.changedTouches?.[0];
            if (!touch) return;

            const dy = touch.clientY - startY;
            const dx = touch.clientX - startX;

            if (Math.abs(dx) > Math.abs(dy)) return;
            if (Math.abs(dy) < 44) return;

            if (dy < 0) {
                focusCardsCentered();
            } else {
                const isStrictMobile = typeof window !== 'undefined' ? window.innerWidth <= 767 : false;

                if (isStrictMobile) {
                    mobileReturnToHistoryArmedRef.current = true;
                    onExitToParentTop?.();
                    return;
                }

                const rootRect = root.getBoundingClientRect();
                if (rootRect.top >= -10) return;
                scrollToHistoryHeader();
            }
        };

        let winStartY = 0;
        let winStartX = 0;
        let winActive = false;

        const onWinTouchStart = (e) => {
            if (isModalOpen) return;
            if (!mobileReturnToHistoryArmedRef.current) return;
            const t = e?.target;
            if (isInsideModalOrControl(t)) return;

            const touch = e.touches?.[0];
            if (!touch) return;
            winStartY = touch.clientY;
            winStartX = touch.clientX;
            winActive = true;
        };

        const onWinTouchEnd = (e) => {
            if (!winActive) return;
            winActive = false;
            if (isModalOpen) return;
            if (!mobileReturnToHistoryArmedRef.current) return;

            const t = e?.target;
            if (isInsideModalOrControl(t)) return;

            const touch = e.changedTouches?.[0];
            if (!touch) return;

            const dy = touch.clientY - winStartY;
            const dx = touch.clientX - winStartX;

            if (Math.abs(dx) > Math.abs(dy)) return;
            if (Math.abs(dy) < 44) return;

            if (dy < 0) {
                mobileReturnToHistoryArmedRef.current = false;
                scrollToHistoryHeader();
            }
        };

        const onWheel = (e) => {
            if (isModalOpen) return;
            const target = e?.target;
            if (!root.contains(target)) return;

            const dy = e.deltaY;
            const dx = e.deltaX || 0;

            if (Math.abs(dx) > Math.abs(dy)) return;
            if (Math.abs(dy) < 44) return;

            if (dy > 0) {
                focusCardsCentered();
            } else {
                const rootRect = root.getBoundingClientRect();
                if (rootRect.top >= -10) return;
                scrollToHistoryHeader();
            }
        };

        root.addEventListener('touchstart', onTouchStart, { passive: true });
        root.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('touchstart', onWinTouchStart, { passive: true });
        window.addEventListener('touchend', onWinTouchEnd, { passive: true });

        return () => {
            root.removeEventListener('touchstart', onTouchStart);
            root.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onWinTouchStart);
            window.removeEventListener('touchend', onWinTouchEnd);
        };
    }, [
        isDesktop,
        isModalOpen,
        cardsFocused,
        setCardsFocused,
        sectionRef,
        historyHeaderRef,
        historyListRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        cardsFocusInProgressRef,
        mobileReturnToHistoryArmedRef,
        lockMobileScroll,
        headerAnimateClass,
        onExitToParentTop,
    ]);
}

