import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper';
import 'swiper/swiper-bundle.min.css';

import HistoryCard from './HistoryCard';
import styles from './HistoryTimeline.module.scss';

export default function HistoryTimelineMobile({
    visibleItems,
    timelineItemsAdmin,
    cardsByYear,
    mobileSlidesOffsetAfter,
    mobileTimelineYearsRef,
    mobileActiveYearIndex,
    mobileIncomingYearIndex,
    isMobileSliding,
    setMobileActiveYearIndex,
    setMobileIncomingYearIndex,
    setIsMobileSliding,
    yearIndexByYear,
    isDesktop,
    handleOpenChronicle,
}) {
    return (
        <div className={styles.history_mobile}>
            <div className={styles.history_mobile_swiper_wrapper}>
                <Swiper
                    className={styles.history_mobile_swiper}
                    modules={[Keyboard]}
                    keyboard={{ enabled: true }}
                    spaceBetween={30}
                    slidesPerView="auto"
                    slidesPerGroup={1}
                    slidesOffsetBefore={24}
                    slidesOffsetAfter={mobileSlidesOffsetAfter}
                    watchSlidesProgress
                    onProgress={(swiper) => {
                        if (!swiper || !swiper.slides) return;

                        const MAX_SHIFT = 80;
                        const TARGET_PROGRESS = -3;
                        const RADIUS = 0.8;

                        swiper.slides.forEach((slide) => {
                            const img = slide.querySelector('[data-card-image="true"]');
                            if (!img) return;

                            const p = typeof slide.progress === 'number' ? slide.progress : 0;

                            const dist = Math.abs(p - TARGET_PROGRESS);
                            if (dist >= RADIUS) {
                                img.style.transform = '';
                                return;
                            }

                            const norm = dist / RADIUS;
                            const t = 1 - norm;
                            const shift = MAX_SHIFT * t;

                            img.style.transform = `translateX(${shift}px)`;
                        });
                    }}
                    onSwiper={(swiper) => {
                        if (!swiper) return;

                        let isClamping = false;

                        swiper.on('setTranslate', (translate) => {
                            if (isClamping) return;

                            let tx =
                                typeof translate === 'number'
                                    ? translate
                                    : swiper.translate || 0;

                            const slides = swiper.slides;
                            if (slides && slides.length) {
                                const lastSlide = slides[slides.length - 1];
                                const lastLeft = lastSlide?.offsetLeft ?? 0;
                                const minTx = 24 - lastLeft;

                                if (Number.isFinite(minTx) && tx < minTx) {
                                    isClamping = true;
                                    tx = minTx;
                                    swiper.setTranslate(tx);
                                    isClamping = false;
                                }
                            }

                            const yearsEl = mobileTimelineYearsRef.current;
                            if (yearsEl) {
                                yearsEl.style.transform = `translate3d(${tx}px, 0, 0)`;
                            }
                        });

                        swiper.on('slideChangeTransitionStart', () => {
                            const nextIndex =
                                typeof swiper.realIndex === 'number'
                                    ? swiper.realIndex
                                    : swiper.activeIndex || 0;

                            const nextItem = visibleItems[nextIndex];
                            if (!nextItem || nextItem.year == null) return;

                            const idx = yearIndexByYear[String(nextItem.year)];
                            if (typeof idx === 'number' && !Number.isNaN(idx)) {
                                setMobileIncomingYearIndex(idx);
                                setIsMobileSliding(true);
                            }
                        });

                        swiper.on('slideChangeTransitionEnd', () => {
                            const activeIndex =
                                typeof swiper.realIndex === 'number'
                                    ? swiper.realIndex
                                    : swiper.activeIndex || 0;

                            const activeItem = visibleItems[activeIndex];
                            if (activeItem && activeItem.year != null) {
                                const idx = yearIndexByYear[String(activeItem.year)];
                                if (typeof idx === 'number' && !Number.isNaN(idx)) {
                                    setMobileActiveYearIndex(idx);
                                }
                            }

                            setMobileIncomingYearIndex(null);
                            setIsMobileSliding(false);
                        });
                    }}
                >
                    {visibleItems.map((item) => (
                        <SwiperSlide
                            key={item.id}
                            className={styles.history_mobile_slide}
                        >
                            <div className={styles.history_card_wrapper}>
                                <HistoryCard
                                    item={{ ...item, onOpenChronicle: handleOpenChronicle }}
                                    variant={item.img ? 1 : 2}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className={styles.timeline}>
                <div className={styles.timeline_line} />

                <div
                    ref={mobileTimelineYearsRef}
                    className={styles.timeline_years}
                >
                    {timelineItemsAdmin.map((year, idx) => {
                        const isLast = idx === timelineItemsAdmin.length - 1;

                        const hasBottomCards = (cardsByYear[year]?.bottom?.length || 0) > 0;
                        const hasTopCards = (cardsByYear[year]?.top?.length || 0) > 0;

                        let yearLabelClass = '';
                        if (hasBottomCards) yearLabelClass = styles.year_label_bottom;
                        else if (hasTopCards) yearLabelClass = styles.year_label_top;

                        let dotScale = 1;
                        if (!isDesktop) {
                            if (idx === mobileActiveYearIndex) {
                                dotScale = 1.2;
                            } else if (isMobileSliding && idx === mobileIncomingYearIndex) {
                                dotScale = 1.4;
                            }
                        }

                        return (
                            <div
                                key={year}
                                className={styles.timeline_year_marker}
                                data-year={year}
                                data-year-marker="true"
                                data-last-year={isLast ? 'true' : 'false'}
                            >
                                <div
                                    className={styles.year_dot}
                                    data-year-dot="true"
                                    style={{ '--dot-scale': dotScale }}
                                />
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
        </div>
    );
}

