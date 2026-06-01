import { memo, useEffect, useState } from 'react';
import styles from './HistoryCard.module.scss';
import { getHistoryPreviewSrc, toHistoryImageSrc } from '../utils/historyCardImageSrc';

function HistoryCard({ item, variant = 1, isBottom = false, onOpenChronicle, eagerImage = false }) {
    const previewImgSrc = getHistoryPreviewSrc(item);
    const hasImage = variant === 1 && !!previewImgSrc;

    const avatarSrc = item?.avatarUrl ? toHistoryImageSrc(item.avatarUrl) : toHistoryImageSrc(item?.avatar);
    const hasAvatar = !!avatarSrc;

    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        setImgLoaded(false);
        setImgFailed(false);
    }, [previewImgSrc]);

    useEffect(() => {
        if (!hasImage || !previewImgSrc) return undefined;

        let cancelled = false;
        const probe = new Image();
        probe.decoding = 'async';
        probe.src = previewImgSrc;

        const markLoaded = () => {
            if (!cancelled) setImgLoaded(true);
        };
        const markFailed = () => {
            if (!cancelled) setImgFailed(true);
        };

        if (probe.complete && probe.naturalWidth > 0) {
            markLoaded();
        } else {
            probe.onload = markLoaded;
            probe.onerror = markFailed;
        }

        return () => {
            cancelled = true;
            probe.onload = null;
            probe.onerror = null;
        };
    }, [hasImage, previewImgSrc]);

    const openChronicle = onOpenChronicle ?? item?.onOpenChronicle;

    const handleCardClick = () => {
        if (openChronicle) {
            openChronicle(item);
        }
    };

    const handleCardClickStop = (e) => {
        e?.stopPropagation?.();
        handleCardClick();
    };

    return (
        <div
            className={`${styles.history_card} ${hasImage ? styles.variant1 : styles.variant2} ${isBottom ? styles.bottom_card : ''
                }`}
            data-history-card-root="true"
            onClick={handleCardClick}
            style={{ cursor: openChronicle ? 'pointer' : 'default' }}
        >
            <div className={styles.card_split} data-card-split="true">
                <div className={styles.split_left} data-split-left="true">
                    <div className={styles.card_content}>
                        {hasAvatar ? (
                            <div className={styles.card_avatar}>
                                <img src={avatarSrc} alt="" className={styles.avatar_image} loading="lazy" decoding="async" />
                            </div>
                        ) : null}

                        <div className={styles.card_text}>
                            <div
                                className={styles.card_title}
                                dangerouslySetInnerHTML={{ __html: item?.description || '' }}
                            />
                            <p className={styles.card_link}>Открыть хронику...</p>
                        </div>
                    </div>
                </div>

                <div className={styles.split_right} data-split-right="true">
                    {hasImage && !imgFailed ? (
                        <div
                            className={styles.card_image}
                            data-card-image="true"
                            onClick={handleCardClickStop}
                            role="button"
                            tabIndex={-1}
                        >
                            <img
                                src={previewImgSrc}
                                alt={item?.title || ''}
                                className={`${styles.card_image_photo} ${imgLoaded ? styles.card_image_photo_loaded : ''}`}
                                draggable={false}
                                loading={eagerImage ? 'eager' : 'lazy'}
                                decoding="async"
                                fetchPriority={eagerImage ? 'high' : 'auto'}
                                onLoad={() => setImgLoaded(true)}
                                onError={() => setImgFailed(true)}
                                onDragStart={(e) => e.preventDefault()}
                                onClick={handleCardClickStop}
                            />
                        </div>
                    ) : (
                        <div
                            className={styles.card_image_placeholder}
                            aria-hidden="true"
                            onClick={handleCardClickStop}
                            role="button"
                            tabIndex={-1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(HistoryCard);
