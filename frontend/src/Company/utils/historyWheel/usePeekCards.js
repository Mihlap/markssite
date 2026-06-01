import gsap from 'gsap';

const SHIFT_X = 26;
const PEEK_MIN_VISIBLE = 24;
const PEEK_MAX_VISIBLE = 260;

function isPeekCard(rect, vw) {
    const intersectsRightEdge = rect.left < vw && rect.right > vw;
    if (!intersectsRightEdge) return false;

    const visibleW = vw - rect.left;
    if (visibleW < PEEK_MIN_VISIBLE || visibleW > PEEK_MAX_VISIBLE) return false;

    return true;
}

function getSplitNodes(card) {
    if (!card) return null;
    const left = card.querySelector('[data-split-left="true"]');
    const right = card.querySelector('[data-split-right="true"]');
    if (!left || !right) return null;
    return { left, right };
}

function setSplitInstant(nodes, { leftX, rightX }) {
    if (!nodes?.left || !nodes?.right) return;

    const l = nodes.left;
    const r = nodes.right;

    if (l.dataset.peekPrevTransition == null) l.dataset.peekPrevTransition = l.style.transition || '';
    if (r.dataset.peekPrevTransition == null) r.dataset.peekPrevTransition = r.style.transition || '';

    l.style.transition = 'none';
    r.style.transition = 'none';

    gsap.set(l, { x: leftX, force3D: true });
    gsap.set(r, { x: rightX, force3D: true });

    requestAnimationFrame(() => {
        try {
            l.style.transition = l.dataset.peekPrevTransition || '';
            r.style.transition = r.dataset.peekPrevTransition || '';
            delete l.dataset.peekPrevTransition;
            delete r.dataset.peekPrevTransition;
        } catch { }
    });
}

function setSplitSmooth(nodes, { leftX, rightX }) {
    if (!nodes?.left || !nodes?.right) return;
    const l = nodes.left;
    const r = nodes.right;

    gsap.killTweensOf(l);
    gsap.killTweensOf(r);

    gsap.to(l, { x: leftX, duration: 0.22, ease: 'power2.out', overwrite: 'auto', force3D: true });
    gsap.to(r, { x: rightX, duration: 0.22, ease: 'power2.out', overwrite: 'auto', force3D: true });
}

export function clearCardSplit(card) {
    const nodes = getSplitNodes(card);
    if (!nodes) return;

    gsap.killTweensOf(nodes.left);
    gsap.killTweensOf(nodes.right);

    gsap.set(nodes.left, { clearProps: 'transform' });
    gsap.set(nodes.right, { clearProps: 'transform' });

    try {
        delete nodes.left.dataset.peekPrevTransition;
        delete nodes.right.dataset.peekPrevTransition;
    } catch { }

    try {
        card.removeAttribute('data-peek-primed');
        card.removeAttribute('data-peek-snapped');
    } catch { }
}

export function createPeekCardsManager(container) {
    const peekStateRef = {
        current: {
            primedCard: null,
            primedLeft: null,
            primedRight: null,
            tl: null,
            start: 0,
            end: 0,
            animating: false,
        },
    };

    const applyPeekStateForRightEdgeCards = () => {
        if (!container) return;
        const vw = window.innerWidth || 0;

        let cards = [];
        try {
            cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
        } catch {
            cards = [];
        }
        if (!cards.length) return;

        for (const card of cards) {
            const r = card.getBoundingClientRect();
            const shouldBePeek = isPeekCard(r, vw);
            const visibleW = vw - r.left;

            if (!shouldBePeek) {
                try {
                    if (card.getAttribute('data-peek-primed') === 'true') {
                        card.removeAttribute('data-peek-primed');
                        if (card.getAttribute('data-peek-snapped') !== 'true') {
                            const nodes = getSplitNodes(card);
                            if (nodes) {
                                gsap.killTweensOf(nodes.left);
                                gsap.killTweensOf(nodes.right);
                                gsap.set(nodes.left, { clearProps: 'transform' });
                                gsap.set(nodes.right, { clearProps: 'transform' });
                            }
                        }
                    }
                } catch { }
                continue;
            }

            if (card.getAttribute('data-peek-snapped') === 'true') continue;
            if (card.getAttribute('data-peek-primed') === 'true') continue;

            const nodes = getSplitNodes(card);
            if (!nodes) continue;

            gsap.killTweensOf(nodes.left);
            gsap.killTweensOf(nodes.right);

            const FLICKER_ZONE_PX = PEEK_MIN_VISIBLE + 18;
            if (visibleW <= FLICKER_ZONE_PX) {
                setSplitInstant(nodes, { leftX: -SHIFT_X, rightX: +SHIFT_X });
            } else {
                setSplitSmooth(nodes, { leftX: -SHIFT_X, rightX: +SHIFT_X });
            }

            try {
                card.setAttribute('data-peek-primed', 'true');
            } catch { }
        }
    };

    const findBestPeekCard = () => {
        if (!container) return null;
        const vw = window.innerWidth || 0;

        let cards = [];
        try {
            cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
        } catch {
            cards = [];
        }
        if (!cards.length) return null;

        let best = null;
        let bestScore = Infinity;

        for (const card of cards) {
            const r = card.getBoundingClientRect();
            if (!isPeekCard(r, vw)) continue;

            const visibleW = vw - r.left;
            const score = Math.abs(visibleW - 120);
            if (score < bestScore) {
                bestScore = score;
                best = card;
            }
        }

        return best;
    };

    const killPeekTween = () => {
        const st = peekStateRef.current;
        if (st.tl) {
            try {
                st.tl.kill();
            } catch { }
        }
        st.tl = null;
        st.start = 0;
        st.end = 0;
        st.animating = false;
    };

    const primePeekCard = () => {
        const st = peekStateRef.current;
        if (st.animating) return;

        applyPeekStateForRightEdgeCards();

        const card = findBestPeekCard();
        if (!card) return;

        if (st.primedCard === card) {
            const nodes = getSplitNodes(card);
            if (nodes) {
                st.primedLeft = nodes.left;
                st.primedRight = nodes.right;
            }
            return;
        }

        if (st.primedCard && st.primedCard !== card) {
            st.primedCard = null;
            st.primedLeft = null;
            st.primedRight = null;
        }

        const nodes = getSplitNodes(card);
        if (!nodes) {
            st.primedCard = null;
            st.primedLeft = null;
            st.primedRight = null;
            return;
        }

        if (card.getAttribute('data-peek-snapped') !== 'true') {
            setSplitInstant(nodes, { leftX: -SHIFT_X, rightX: +SHIFT_X });
            try {
                card.setAttribute('data-peek-primed', 'true');
            } catch { }
        }

        st.primedCard = card;
        st.primedLeft = nodes.left;
        st.primedRight = nodes.right;
    };

    const armPeekForSnap = (startOffset, endOffset) => {
        const st = peekStateRef.current;

        killPeekTween();
        primePeekCard();

        if (!st.primedCard || !st.primedLeft || !st.primedRight) return;

        try {
            st.primedCard.setAttribute('data-peek-snapped', 'true');
        } catch { }

        st.animating = true;
        st.start = Number(startOffset || 0);
        st.end = Number(endOffset || 0);

        const tl = gsap.timeline({ paused: true });
        tl.to(st.primedLeft, { x: 0, ease: 'none', duration: 1 }, 0);
        tl.to(st.primedRight, { x: 0, ease: 'none', duration: 1 }, 0);

        st.tl = tl;
    };

    const updatePeekProgress = (currentOffset) => {
        const st = peekStateRef.current;
        if (!st.tl || !st.animating) return;

        const s = Number(st.start || 0);
        const e = Number(st.end || 0);
        const denom = e - s;

        if (!Number.isFinite(denom) || Math.abs(denom) < 0.0001) {
            st.tl.progress(1);
            return;
        }

        const p = (Number(currentOffset || 0) - s) / denom;
        const pp = Math.max(0, Math.min(1, p));
        st.tl.progress(pp);
    };

    const finishPeekSnap = () => {
        const st = peekStateRef.current;
        if (st.tl) st.tl.progress(1);

        if (st.primedCard) {
            const nodes = getSplitNodes(st.primedCard);
            if (nodes) {
                gsap.killTweensOf(nodes.left);
                gsap.killTweensOf(nodes.right);
                gsap.set(nodes.left, { clearProps: 'transform' });
                gsap.set(nodes.right, { clearProps: 'transform' });
            }

            try {
                st.primedCard.removeAttribute('data-peek-primed');
                st.primedCard.setAttribute('data-peek-snapped', 'true');
            } catch { }
        }

        killPeekTween();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!container) return;
                let cards = [];
                try {
                    cards = Array.from(container.querySelectorAll('[data-history-card-root="true"]'));
                } catch {
                    cards = [];
                }
                for (const card of cards) {
                    try {
                        card.removeAttribute('data-peek-snapped');
                    } catch { }
                }

                applyPeekStateForRightEdgeCards();
                primePeekCard();
            });
        });
    };

    return {
        applyPeekStateForRightEdgeCards,
        primePeekCard,
        killPeekTween,
        armPeekForSnap,
        updatePeekProgress,
        finishPeekSnap,
    };
}
