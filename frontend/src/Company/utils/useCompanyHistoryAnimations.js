import { useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { flushSync } from 'react-dom';
import headerStyles from '../CompanyHistory/CompanyHistoryHeader.module.scss';

gsap.registerPlugin(ScrollToPlugin);

// function getScrollYToFullyShowElement(el, { padTop = 40, padBottom = 40 } = {}) {
//   if (!el) return window.pageYOffset;

//   const vh = window.innerHeight;
//   const r = el.getBoundingClientRect();
//   const topAbs = r.top + window.pageYOffset;
//   const bottomAbs = r.bottom + window.pageYOffset;
//   const elH = r.height;

//   if (elH >= vh - (padTop + padBottom)) return Math.max(0, topAbs - padTop);

//   const minY = Math.max(0, topAbs - padTop);
//   const maxY = Math.max(0, bottomAbs - (vh - padBottom));

//   const y = window.pageYOffset;
//   if (y < maxY) return maxY;
//   if (y > minY) return minY;
//   return y;
// }

export function useCompanyHistoryAnimations({
  animationReady,
  historyTagRef,
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

      const ae = document.activeElement;
      if (ae && el.contains(ae) && typeof ae.blur === 'function') ae.blur();

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
    (immediate = true, { duration = 0.6, ease = 'power1.inOut' } = {}) => {
      const tag = historyTagRef.current;
      if (!tag) return;

      gsap.killTweensOf(tag);
      if (immediate) {
        tag.style.opacity = '0';
        tag.style.visibility = 'hidden';
        gsap.set(tag, { clearProps: 'transform' });
      } else {
        gsap.to(tag, {
          opacity: 0,
          duration,
          ease,
          overwrite: true,
          clearProps: 'transform',
          onComplete: () => {
            tag.style.visibility = 'hidden';
            gsap.set(tag, { clearProps: 'transform' });
          },
        });
      }
    },
    [historyTagRef]
  );

  const showAndPlaceHistoryTag = useCallback(
    (opts = {}) => {
      const { immediate = false, duration = 0.6, ease = 'power1.out' } = opts;
      const tag = historyTagRef.current;
      if (!tag) return;

      gsap.killTweensOf(tag);

      gsap.set(tag, { clearProps: 'transform' });
      tag.style.visibility = 'visible';

      if (immediate) {
        tag.style.opacity = '1';
      } else {
        gsap.to(tag, {
          opacity: 1,
          duration,
          ease,
          overwrite: true,
          clearProps: 'transform',
        });
      }
    },
    [historyTagRef]
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

  const cleanupCardsFocusStyles = (cardsEl) => {
    if (!cardsEl) return;

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

    const wrapper = cardsEl.querySelector('[class*="timeline_wrapper"]');
    if (wrapper) {
      wrapper.style.gridTemplateRows = '';
      wrapper.style.height = '';
      wrapper.style.overflow = '';

      const rowTop = wrapper.querySelector('.cards_row_top');
      const rowBot = wrapper.querySelector('.cards_row_bottom');
      const tl = wrapper.querySelector('.timeline');

      if (rowTop) { rowTop.style.gridRow = ''; rowTop.style.alignSelf = ''; }
      if (rowBot) { rowBot.style.gridRow = ''; rowBot.style.alignSelf = ''; }
      if (tl) { tl.style.gridRow = ''; tl.style.alignSelf = ''; tl.style.margin = ''; }
    }

    const root = sectionRef?.current;
    if (root) root.removeAttribute('data-focus-layout');
  };

  const exitCardsFocusSilent = useCallback(
    (cardsEl) => {
      if (!cardsEl) return;

      const ae = document.activeElement;
      if (ae && yearsScaleRef?.current && yearsScaleRef.current.contains(ae) && typeof ae.blur === 'function') {
        ae.blur();
      }

      hideHistoryTag(true);
      hideYearsScale(true, { y: 40 });

      if (backgroundRef?.current) {
        gsap.killTweensOf(backgroundRef.current);
        gsap.set(backgroundRef.current, { y: 0, overwrite: true });
      }

      gsap.killTweensOf(cardsEl);
      gsap.killTweensOf(window);

      cardsFocusInProgressRef.current = true;
      hasScrollToHeaderTriggered.current = false;
      hasScrollToCardsTriggered.current = false;

      flushSync(() => {
        setCardsFocused(false);
      });

      cleanupCardsFocusStyles(cardsEl);

      cardsFocusInProgressRef.current = false;
      hasScrollToHeaderTriggered.current = false;
      headerIntroArmedRef.current = true;
    },
    [
      hideHistoryTag,
      hideYearsScale,
      backgroundRef,
      yearsScaleRef,
      cardsFocusInProgressRef,
      hasScrollToHeaderTriggered,
      hasScrollToCardsTriggered,
      setCardsFocused,
      sectionRef,
      headerIntroArmedRef,
    ]
  );

  const exitCardsFocus = useCallback(
    (cardsEl) => {
      if (!cardsEl) return;

      const snap1 = gsap.utils?.snap ? gsap.utils.snap(1) : (v) => Math.round(v);

      const rectFirst = cardsEl.getBoundingClientRect();

      cardsFocusInProgressRef.current = true;
      hasScrollToHeaderTriggered.current = true;
      hasScrollToCardsTriggered.current = false;

      const returnDuration = 0.9;
      const returnEase = 'power2.inOut';

      gsap.killTweensOf(cardsEl);
      gsap.killTweensOf(window);

      const xBefore = Number(gsap.getProperty(cardsEl, 'x') || 0);
      const yBefore = Number(gsap.getProperty(cardsEl, 'y') || 0);
      gsap.set(cardsEl, { x: snap1(xBefore), y: snap1(yBefore), force3D: true });

      flushSync(() => {
        setCardsFocused(false);
      });

      cleanupCardsFocusStyles(cardsEl);

      cardsEl.style.overflow = 'visible';
      const timelineWrapper = cardsEl.querySelector('[class*="timeline_wrapper"]');
      if (timelineWrapper) {
        timelineWrapper.style.overflow = 'visible';
      }

      const rectAfter = cardsEl.getBoundingClientRect();

      const invertX = snap1(rectFirst.left - rectAfter.left);
      const invertY = snap1(rectFirst.top - rectAfter.top);

      cardsEl.style.willChange = 'transform';
      gsap.set(cardsEl, {
        x: invertX,
        y: invertY,
        force3D: true,
        immediateRender: true,
      });

      const headerEl = historyHeaderRef?.current;
      let scrollTargetY = window.pageYOffset;
      if (headerEl) {
        const headerRect = headerEl.getBoundingClientRect();
        scrollTargetY = Math.max(0, headerRect.top + window.pageYOffset);
      }

      const tag = historyTagRef.current;
      const tl = gsap.timeline({
        defaults: { duration: returnDuration, ease: returnEase },
        onComplete: () => {
          cardsEl.style.overflow = '';
          cardsEl.style.willChange = '';
          if (timelineWrapper) {
            timelineWrapper.style.overflow = '';
          }
          gsap.set(cardsEl, { clearProps: 'transform' });

          hideYearsScale(false, { duration: 0.35, ease: 'power2.out', y: 40 });

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

      if (tag) {
        gsap.killTweensOf(tag);
        gsap.set(tag, { clearProps: 'transform' });
        tag.style.visibility = 'visible';
        tl.to(tag, {
          opacity: 0,
          duration: returnDuration,
          ease: 'power1.inOut',
          overwrite: 'auto',
          clearProps: 'transform',
          onComplete: () => {
            tag.style.visibility = 'hidden';
            gsap.set(tag, { clearProps: 'transform' });
          },
        }, 0);
      }

      if (headerEl) {
        tl.to(window, {
          duration: returnDuration,
          ease: returnEase,
          overwrite: 'auto',
          scrollTo: { y: scrollTargetY, autoKill: false },
        }, 0);
      }

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
    exitCardsFocusSilent,
    showAndPlaceHistoryTag,
    hideHistoryTag,
    showYearsScale,
    hideYearsScale,
    onCardsFocusEnter,
  };
}
