import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import 'swiper/css';

import HistoryCard from './HistoryCard';
import HistoryYearPickerModal from './HistoryYearPickerModal';
import styles from './HistoryTimeline.module.scss';

import strelka from '../icons/strelka.svg';

export default function HistoryTimelineMobile({
    visibleItems,
    timelineItemsAdmin,
    cardsByYear,
    mobileSlidesOffsetAfter,
    mobileTimelineYearsRef,
    mobileActiveYearIndex,
    cardsFocused,
    setMobileActiveYearIndex,
    setMobileIncomingYearIndex,
    setIsMobileSliding,
    yearIndexByYear,
    isDesktop,
    handleOpenChronicle,
    onSkip,
    onUnlockScroll,
}) {
    const swiperRef = useRef(null);
    const [buttonYearIndex, setButtonYearIndex] = useState(
        typeof mobileActiveYearIndex === 'number' ? mobileActiveYearIndex : 0
    );
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
    const isStrictMobile =
        !isDesktop && typeof window !== 'undefined' && window.innerWidth <= 767;
    const lastAnimatedYearRef = useRef(null);

    const handleYearPickerSelect = ({ index: yearIndex, year }) => {
        if (typeof yearIndex === 'number' && !Number.isNaN(yearIndex)) {
            setButtonYearIndex(yearIndex);
        }

        const targetIndex = visibleItems.findIndex(
            (item) => item.year != null && String(item.year) === String(year)
        );

        if (swiperRef.current && targetIndex >= 0) {
            swiperRef.current.slideTo(targetIndex);
        }

        const idx = yearIndexByYear[String(year)];
        if (typeof idx === 'number' && !Number.isNaN(idx)) {
            setMobileIncomingYearIndex(idx);
            setIsMobileSliding(true);
        }
    };

    const activeYearLabel =
        typeof buttonYearIndex === 'number' &&
            buttonYearIndex >= 0 &&
            buttonYearIndex < timelineItemsAdmin.length
            ? timelineItemsAdmin[buttonYearIndex]
            : null;

    return (
        <div className={styles.history_mobile}>
            {activeYearLabel &&
                (isStrictMobile ? (
                    <div
                        className={styles.history_mobile_topbar}
                        data-history-mobile-topbar="true"
                    >
                        <div
                            className={`${styles.history_mobile_tag} ${cardsFocused ? styles.is_visible : ''}`}
                            aria-hidden={!cardsFocused}
                        >
                            История MARKS GROUP
                        </div>
                        <div className={styles.history_mobile_year_button_wrapper}>
                            <button
                                type="button"
                                className={styles.history_mobile_year_button}
                                onClick={() => setIsYearPickerOpen(true)}
                            >
                                {activeYearLabel}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.history_mobile_year_button_wrapper}>
                        <button
                            type="button"
                            className={styles.history_mobile_year_button}
                            onClick={() => setIsYearPickerOpen(true)}
                        >
                            {activeYearLabel}
                        </button>
                    </div>
                ))}
            <HistoryYearPickerModal
                isOpen={isYearPickerOpen}
                onClose={() => setIsYearPickerOpen(false)}
                years={timelineItemsAdmin}
                cardsByYear={cardsByYear}
                activeYearIndex={buttonYearIndex}
                onSelectYear={handleYearPickerSelect}
            />
            {isStrictMobile && (
                <div
                    data-history-mobile-focus-anchor="true"
                    className={styles.history_mobile_focus_anchor}
                    aria-hidden="true"
                />
            )}
            <div
                className={`${styles.history_mobile_swiper_wrapper} ${styles.history_mobile_swiper_wrapper_mask_left} ${isStrictMobile ? styles.history_mobile_swiper_wrapper_sticky : ''
                    }`}
            >
                <Swiper
                    className={styles.history_mobile_swiper}
                    modules={[Keyboard]}
                    keyboard={{ enabled: true }}
                    spaceBetween={30}
                    slidesPerView="auto"
                    slidesPerGroup={1}
                    slidesOffsetBefore={isStrictMobile ? 0 : 55}
                    slidesOffsetAfter={mobileSlidesOffsetAfter}
                    watchSlidesProgress
                    onProgress={(swiper) => {
                        if (!swiper || !swiper.slides) return;
                        const MAX_SHIFT = isStrictMobile ? 50 : 80;
                        const TARGET_PROGRESS = isStrictMobile ? -1.5 : -3;
                        const RADIUS = isStrictMobile ? 1.2 : 0.8;

                        swiper.slides.forEach((slide) => {
                            const img = slide.querySelector('[data-card-image=\"true\"]');
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

                        swiperRef.current = swiper;

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

                                    if (isStrictMobile && typeof onUnlockScroll === 'function') {
                                        onUnlockScroll();
                                    }
                                }

                                const offsetBefore =
                                    typeof swiper.params.slidesOffsetBefore === 'number'
                                        ? swiper.params.slidesOffsetBefore
                                        : 55;
                                const viewportLeft = -tx + offsetBefore;

                                let leftIndex = 0;
                                for (let i = 0; i < slides.length; i += 1) {
                                    const slideEl = slides[i];
                                    if (!slideEl) continue;

                                    const slideLeft = slideEl.offsetLeft ?? 0;
                                    const slideWidth = slideEl.offsetWidth ?? 0;
                                    const threshold = slideLeft + slideWidth * 0.3;
                                    if (threshold > viewportLeft + 1) {
                                        leftIndex = i;
                                        break;
                                    }
                                }

                                const itemForButton = visibleItems[leftIndex];
                                if (itemForButton && itemForButton.year != null) {
                                    const yearStr = String(itemForButton.year);
                                    const idxForButton = yearIndexByYear[yearStr];
                                    if (
                                        typeof idxForButton === 'number' &&
                                        !Number.isNaN(idxForButton)
                                    ) {
                                        setButtonYearIndex(idxForButton);

                                        if (!isDesktop) {
                                            const yearsRoot = mobileTimelineYearsRef.current;
                                            if (yearsRoot) {
                                                const markers = yearsRoot.querySelectorAll(
                                                    '[data-year-marker="true"]'
                                                );

                                                markers.forEach((m) => {
                                                    const y = m.getAttribute('data-year');
                                                    const dot = m.querySelector(
                                                        '[data-year-dot="true"]'
                                                    );
                                                    if (!dot) return;

                                                    gsap.killTweensOf(dot);

                                                    if (y !== yearStr) {
                                                        gsap.to(dot, {
                                                            duration: 0.25,
                                                            ease: 'power2.out',
                                                            overwrite: 'auto',
                                                            '--dot-scale': 1,
                                                        });
                                                        return;
                                                    }

                                                    const tl = gsap.timeline({
                                                        defaults: {
                                                            ease: 'power2.out',
                                                            overwrite: 'auto',
                                                        },
                                                    });

                                                    tl.to(dot, {
                                                        duration: 0.22,
                                                        '--dot-scale': 1.4,
                                                    }).to(dot, {
                                                        duration: 0.18,
                                                        '--dot-scale': 1.2,
                                                    });

                                                    lastAnimatedYearRef.current = yearStr;
                                                });
                                            }
                                        }
                                    }
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

                        const dotScale = 1;

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

            {isStrictMobile && onSkip && (
                <div className={styles.history_mobile_skip_wrapper}>
                    <button
                        type="button"
                        className={styles.history_mobile_skip_button}
                        onClick={onSkip}
                    >
                        Пропустить
                        <img
                            className={styles.history_mobile_skip_arrow}
                            src={strelka}
                            alt=""
                            aria-hidden="true"
                        />
                    </button>
                </div>
            )}
        </div>
    );
}

