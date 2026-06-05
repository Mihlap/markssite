import { useMemo } from 'react';

function sortHistoryItems(a, b) {
    const ao = a.order ?? 0;
    const bo = b.order ?? 0;
    if (ao !== bo) return ao - bo;

    const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (at !== bt) return at - bt;

    return String(a.id ?? '').localeCompare(String(b.id ?? ''));
}

export function useCompanyHistoryModel(historyItems) {
    const visibleItems = useMemo(() => {
        return [...(historyItems || [])].filter((item) => !item.hidden).sort(sortHistoryItems);
    }, [historyItems]);

    const { timelineItemsAdmin, cardsByYear, scaleYearsAsc } = useMemo(() => {
        const yearsAdmin = [];
        const seen = new Set();

        for (const item of visibleItems) {
            if (item.year == null) continue;
            const ys = String(item.year);
            if (!seen.has(ys)) {
                seen.add(ys);
                yearsAdmin.push(ys);
            }
        }

        const grouped = {};
        for (const y of yearsAdmin) grouped[y] = { top: [], bottom: [] };

        let globalIndex = 0;
        for (const item of visibleItems) {
            if (item.year == null) continue;
            const y = String(item.year);

            if (!grouped[y]) grouped[y] = { top: [], bottom: [] };

            if (globalIndex % 2 === 0) grouped[y].top.push(item);
            else grouped[y].bottom.push(item);

            globalIndex += 1;
        }

        const yearsAsc = [...yearsAdmin].sort((a, b) => (Number(a) || 0) - (Number(b) || 0));

        return {
            timelineItemsAdmin: yearsAdmin,
            cardsByYear: grouped,
            scaleYearsAsc: yearsAsc,
        };
    }, [visibleItems]);

    const yearIndexByYear = useMemo(() => {
        const map = {};
        timelineItemsAdmin.forEach((y, idx) => {
            map[String(y)] = idx;
        });
        return map;
    }, [timelineItemsAdmin]);

    return { visibleItems, timelineItemsAdmin, cardsByYear, scaleYearsAsc, yearIndexByYear };
}

