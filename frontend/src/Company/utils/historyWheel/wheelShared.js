import gsap from 'gsap';

export const stopWheelHard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
};

export const setFocusPhaseEntering = (sectionRef) => {
    const root = sectionRef?.current;
    if (!root) return;
    root.removeAttribute('data-focus-layout');
};

export const setFocusPhaseReady = (sectionRef) => {
    const root = sectionRef?.current;
    if (!root) return;
    root.setAttribute('data-focus-layout', 'ready');
};

export const clearFocusPhase = (sectionRef) => {
    const root = sectionRef?.current;
    if (!root) return;
    root.removeAttribute('data-focus-layout');
};

export const markRecentlyExited = (recentlyExitedCardsRef) => {
    recentlyExitedCardsRef.current = { active: true, anchorY: window.pageYOffset };
};

export const clearRecentlyExitedIfFar = (recentlyExitedCardsRef, snapY) => {
    const st = recentlyExitedCardsRef.current;
    if (!st.active) return true;

    if (Math.abs(window.pageYOffset - snapY) > 420) {
        recentlyExitedCardsRef.current.active = false;
        return true;
    }
    return false;
};

export const getLastCard = (container) => {
    if (!container) return null;
    const groups = container.querySelectorAll('[data-last-cards="true"]');
    if (!groups.length) return null;

    let rightmost = null;
    let maxRight = -Infinity;

    groups.forEach((group) => {
        const cards = group.querySelectorAll('[class*="history_card_wrapper"]');
        cards.forEach((card) => {
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

export const getMaxHorizontalOffsetToCenterLast = (container, horizontalOffsetRef) => {
    const lastCard = getLastCard(container);
    if (!lastCard) return 0;

    const rect = lastCard.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2 + (horizontalOffsetRef.current || 0);
    const viewportCenterX = window.innerWidth / 2;

    return Math.max(0, cardCenterX - viewportCenterX);
};

export const isHistoryActive = (sectionRef, e) => {
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

export const computeSnapY = (timelineEl) => {
    const lineEl = timelineEl.querySelector('[class*="timeline_line"]') || timelineEl;
    const rect = lineEl.getBoundingClientRect();
    const lineCenterAbs = rect.top + window.pageYOffset + rect.height / 2;
    return Math.max(0, lineCenterAbs - window.innerHeight / 2);
};

export const getSectionAbs = (sectionRef) => {
    const root = sectionRef?.current;
    if (!root) return null;
    const r = root.getBoundingClientRect();
    return { topAbs: r.top + window.pageYOffset, bottomAbs: r.bottom + window.pageYOffset };
};

export const shouldConsiderSnap = (y0, y1, snapY, sectionAbs, SNAP_ZONE = 120) => {
    if (!sectionAbs) return false;

    const corridorTop = sectionAbs.topAbs - window.innerHeight * 1.2;
    const corridorBottom = sectionAbs.bottomAbs + window.innerHeight * 1.2;

    const inCorridor = Math.max(y0, y1) >= corridorTop && Math.min(y0, y1) <= corridorBottom;
    if (!inCorridor) return false;

    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    const crosses = snapY >= minY - SNAP_ZONE && snapY <= maxY + SNAP_ZONE;
    const near = Math.abs(y0 - snapY) <= SNAP_ZONE;

    return crosses || near;
};

export const killVTween = (vTweenRef) => {
    if (vTweenRef.current) {
        vTweenRef.current.kill();
        vTweenRef.current = null;
    }
    gsap.killTweensOf(window);
};
