import HistoryCard from './HistoryCard';
import styles from './HistoryTimeline.module.scss';

export default function HistoryTimelineDesktop({
    timelineItemsAdmin,
    cardsByYear,
    isTablet,
    handleOpenChronicle,
    timelineWrapperRef,
    cardsTopRowRef,
    padRightNum,
}) {
    return (
        <div
            ref={timelineWrapperRef}
            className={styles.timeline_wrapper}
            data-pad-right={padRightNum}
        >
            <div ref={cardsTopRowRef} className={styles.cards_row_top}>
                {timelineItemsAdmin.map((year, idx) => {
                    const isLast = idx === timelineItemsAdmin.length - 1;
                    const topItems = cardsByYear[year]?.top || [];
                    const bottomItemsForTablet = isTablet ? cardsByYear[year]?.bottom || [] : [];
                    const itemsToRender = isTablet ? [...topItems, ...bottomItemsForTablet] : topItems;

                    return (
                        <div
                            key={`top-${year}`}
                            className={styles.year_cards_group}
                            data-year={year}
                            data-last-cards={isLast ? 'true' : 'false'}
                        >
                            {itemsToRender.map((item) => (
                                <div key={item.id} className={styles.history_card_wrapper}>
                                    <HistoryCard
                                        item={{ ...item, onOpenChronicle: handleOpenChronicle }}
                                        variant={item.img ? 1 : 2}
                                    />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className={styles.timeline}>
                <div className={styles.timeline_line} />

                <div className={styles.timeline_years}>
                    {timelineItemsAdmin.map((year, idx) => {
                        const isLast = idx === timelineItemsAdmin.length - 1;

                        const hasBottomCards = (cardsByYear[year]?.bottom?.length || 0) > 0;
                        const hasTopCards = (cardsByYear[year]?.top?.length || 0) > 0;

                        let yearLabelClass = '';
                        if (hasBottomCards) yearLabelClass = styles.year_label_bottom;
                        else if (hasTopCards) yearLabelClass = styles.year_label_top;

                        return (
                            <div
                                key={year}
                                className={styles.timeline_year_marker}
                                data-year={year}
                                data-year-marker="true"
                                data-last-year={isLast ? 'true' : 'false'}
                            >
                                <div className={styles.year_dot} data-year-dot="true" />
                                <div className={`${styles.year_label} ${yearLabelClass}`}>{year}</div>

                                {hasTopCards && (
                                    <div className={`${styles.year_connector} ${styles.connector_top}`} />
                                )}
                                {hasBottomCards && (
                                    <div className={`${styles.year_connector} ${styles.connector_bottom}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {!isTablet && (
                <div className={styles.cards_row_bottom}>
                    {timelineItemsAdmin.map((year, idx) => {
                        const isLast = idx === timelineItemsAdmin.length - 1;
                        return (
                            <div
                                key={`bottom-${year}`}
                                className={styles.year_cards_group}
                                data-year={year}
                                data-last-cards={isLast ? 'true' : 'false'}
                            >
                                {cardsByYear[year]?.bottom.map((item) => (
                                    <div key={item.id} className={styles.history_card_wrapper}>
                                        <HistoryCard
                                            item={{ ...item, onOpenChronicle: handleOpenChronicle }}
                                            variant={item.img ? 1 : 2}
                                            isBottom
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

