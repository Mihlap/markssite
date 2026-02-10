import { useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { flushSync } from 'react-dom';
import headerStyles from '../CompanyHistory/CompanyHistoryHeader.module.scss';

gsap.registerPlugin(ScrollToPlugin);

function getScrollYToFullyShowElement(el, { padTop = 40, padBottom = 40 } = {}) {
  if (!el) return window.pageYOffset;

  const vh = window.innerHeight;
  const r = el.getBoundingClientRect();
  const topAbs = r.top + window.pageYOffset;
  const bottomAbs = r.bottom + window.pageYOffset;
  const elH = r.height;

  if (elH >= vh - (padTop + padBottom)) return Math.max(0, topAbs - padTop);

  const minY = Math.max(0, topAbs - padTop);
  const maxY = Math.max(0, bottomAbs - (vh - padBottom));

  const y = window.pageYOffset;
  if (y < maxY) return maxY;
  if (y > minY) return minY;
  return y;
}

export function useCompanyHistoryAnimations({
  animationReady,
  historyTagRef,
  cardsTopRowRef,
  marksGroupRef,
  titleRef,
  subtitleLineRef,
  subtitleLine1Ref,
  subtitleLine2Ref,
  backgroundRef,
  sectionRef,
  historyHeaderRef,
  cardsFocusInProgressRef,
  hasScrollToHeaderTriggered,
  hasScrollToCardsTriggered,
  hasRestoreTriggered,
  hasSplitTriggered,
  headerIntroArmedRef,
  yearsScaleRef,
  setCardsFocused,
}) {
  const hideYearsScale = useCallback(
    (immediate = true, { duration = 0.6, ease = 'power2.inOut', y = 40 } = {}) => {
      const el = yearsScaleRef?.current;
      if (!el) return;

      gsap.killTweensOf(el);

      if (immediate) {
        gsap.set(el, { autoAlpha: 0, y, overwrite: true });
        return;
      }

      gsap.to(el, {
        autoAlpha: 0,
        y,
        duration,
        ease,
        overwrite: true,
      });
    },
    [yearsScaleRef]
  );

  const showYearsScale = useCallback(
    (immediate = false, { duration = 0.9, ease = 'power2.inOut' } = {}) => {
      const el = yearsScaleRef?.current;
      if (!el) return;
      gsap.killTweensOf(el);

      if (immediate) {
        gsap.set(el, { autoAlpha: 1, y: 0, overwrite: true });
        return;
      }

      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration,
        ease,
        overwrite: true,
      });
    },
    [yearsScaleRef]
  );

  useEffect(() => {
    hideYearsScale(true);
  }, [hideYearsScale]);

  const hideHistoryTag = useCallback(
    (immediate = true) => {
      const tag = historyTagRef.current;
      if (!tag) return;

      gsap.killTweensOf(tag);
      gsap.set(tag, {
        autoAlpha: 0,
        ...(immediate ? { y: 0 } : null),
        overwrite: true,
      });
    },
    [historyTagRef]
  );

  const showAndPlaceHistoryTag = useCallback(
    (opts = {}) => {
      const { immediate = false } = opts;

      const tag = historyTagRef.current;
      const topRow = cardsTopRowRef?.current;
      const cardsContainer = tag?.parentElement;

      if (!tag || !topRow || !cardsContainer) return;
      if (cardsFocusInProgressRef?.current) return;

      const place = () => {
        const w = window.innerWidth;
        const gap = w >= 1600 ? 155 : 54;
        const desiredLeft = Math.max(24, Math.min(w * 0.04, 48));

        gsap.killTweensOf(tag);
        gsap.set(tag, { x: 0, y: 0, autoAlpha: 0, overwrite: true });

        const topRowRect = topRow.getBoundingClientRect();
        const tagRect0 = tag.getBoundingClientRect();

        const targetBottom = topRowRect.top - gap;
        const deltaY = targetBottom - tagRect0.bottom;

        gsap.set(tag, { y: deltaY, autoAlpha: 0, overwrite: true });

        const tagRect1 = tag.getBoundingClientRect();
        const deltaX = desiredLeft - tagRect1.left;

        gsap.set(tag, { x: deltaX, autoAlpha: 0, overwrite: true });

        if (immediate) {
          gsap.set(tag, { autoAlpha: 1, overwrite: true });
          return;
        }

        gsap.to(tag, {
          autoAlpha: 1,
          duration: 0.18,
          ease: 'power1.out',
          overwrite: true,
        });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          gsap.delayedCall(0, place);
        });
      });
    },
    [historyTagRef, cardsTopRowRef, cardsFocusInProgressRef]
  );

  const onCardsFocusEnter = useCallback(
    ({ tl, duration = 0.9, ease = 'power2.inOut' } = {}) => {
      const el = yearsScaleRef?.current;
      if (!el) return;
     
      if (tl) {
        tl.to(el, { autoAlpha: 1, y: 0, overwrite: 'auto' }, 0);
      } else {
        showYearsScale(false, { duration, ease });
      }
    },
    [yearsScaleRef, showYearsScale]
  );

  const exitCardsFocus = useCallback(
    (cardsEl) => {
      if (!cardsEl) return;

      hideHistoryTag(true);

      const snap1 = gsap.utils?.snap ? gsap.utils.snap(1) : (v) => Math.round(v);
      const rectFirst = cardsEl.getBoundingClientRect();

      cardsFocusInProgressRef.current = true;
      hasScrollToHeaderTriggered.current = true;
      hasScrollToCardsTriggered.current = false;

      const returnDuration = 0.9;
      const returnEase = 'power2.inOut';

      gsap.killTweensOf(cardsEl);
      gsap.killTweensOf(window);

      cardsEl.style.willChange = 'transform';

      const xBefore = Number(gsap.getProperty(cardsEl, 'x') || 0);
      const yBefore = Number(gsap.getProperty(cardsEl, 'y') || 0);
      gsap.set(cardsEl, { x: snap1(xBefore), y: snap1(yBefore), force3D: true });
    
      flushSync(() => {
        setCardsFocused(false);
      });

      const rectAfter = cardsEl.getBoundingClientRect();
      const xAfter = Number(gsap.getProperty(cardsEl, 'x') || 0);
      const yAfter = Number(gsap.getProperty(cardsEl, 'y') || 0);

      const lastLeft = rectAfter.left - xAfter;
      const lastTop = rectAfter.top - yAfter;

      const invertX = snap1(rectFirst.left - lastLeft);
      const invertY = snap1(rectFirst.top - lastTop);

      gsap.set(cardsEl, {
        x: invertX,
        y: invertY,
        force3D: true,
        immediateRender: true,
      });

      const tl = gsap.timeline({
        defaults: { duration: returnDuration, ease: returnEase },
        onComplete: () => {       
          cardsEl.style.marginTop = '';
          cardsEl.style.marginBottom = '';
          cardsEl.style.padding = '';
          cardsEl.style.top = '';
          cardsEl.style.display = '';
          cardsEl.style.boxSizing = '';
          cardsEl.style.overflow = '';
          cardsEl.style.overscrollBehavior = '';
          cardsEl.style.width = '';
          cardsEl.style.minWidth = '';
          cardsEl.style.maxWidth = '';
          cardsEl.style.height = '';
          cardsEl.style.minHeight = '';
          cardsEl.style.opacity = '';
          cardsEl.style.pointerEvents = '';
          cardsEl.style.visibility = '';
          cardsEl.style.willChange = '';
          cardsEl.style.transition = '';

          gsap.set(cardsEl, { x: 0, y: 0, clearProps: 'transform' });

          const root = sectionRef?.current;
          if (root) root.removeAttribute('data-focus-layout');
    
          hideYearsScale(false, { duration: 0.35, ease: 'power2.out', y: 40 });

          const headerEl = historyHeaderRef?.current;
          if (headerEl) {
            const targetY = getScrollYToFullyShowElement(headerEl, { padTop: 40, padBottom: 40 });
            gsap.to(window, {
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
              scrollTo: { y: targetY, autoKill: false },
            });
          }

          cardsFocusInProgressRef.current = false;
          hasScrollToHeaderTriggered.current = false;
          headerIntroArmedRef.current = true;

          requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));

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
            el.style.transform = '';
            el.classList.remove(headerStyles.animate);
          });
        },
      });
    
      if (backgroundRef.current) {
        tl.to(backgroundRef.current, { y: 0, overwrite: 'auto' }, 0);
      }
 
      if (yearsScaleRef?.current) {
        tl.to(yearsScaleRef.current, { autoAlpha: 0, y: 40, overwrite: 'auto' }, 0);
      }

      tl.to(
        cardsEl,
        {
          x: 0,
          y: 0,
          ease: returnEase,
          overwrite: 'auto',
          force3D: true,
          autoRound: true,
        },
        0
      );
    },
    [
      animationReady,
      hideHistoryTag,
      hideYearsScale,
      showYearsScale,
      backgroundRef,
      sectionRef,
      historyHeaderRef,
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
      yearsScaleRef,
      setCardsFocused,
    ]
  );

  return {
    exitCardsFocus,
    showAndPlaceHistoryTag,
    hideHistoryTag,
    showYearsScale,
    hideYearsScale,    
    onCardsFocusEnter,
  };
}
