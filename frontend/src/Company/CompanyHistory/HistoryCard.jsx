import { memo } from 'react';
import styles from './HistoryCard.module.scss';

const bucket_url = (process.env.REACT_APP_S3_BUCKET_URL || '').replace(/\/+$/, '');

const isHttp = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);
const toSrc = (raw) => {
    if (!raw) return '';
    if (isHttp(raw)) return raw;
    if (!bucket_url) return String(raw);
    return `${bucket_url}/${String(raw).replace(/^\/+/, '')}`;
};

function HistoryCard({ item, variant = 1, isBottom = false, onOpenChronicle }) {
    const previewImgSrc = item?.previewImageUrl ? toSrc(item.previewImageUrl) : toSrc(item?.img);
    const hasImage = variant === 1 && !!previewImgSrc;

    const avatarSrc = item?.avatarUrl ? toSrc(item.avatarUrl) : toSrc(item?.avatar);
    const hasAvatar = !!avatarSrc;

    const openChronicle = onOpenChronicle ?? item?.onOpenChronicle;

    const handleCardClick = (e) => {
        if (openChronicle) {
            openChronicle(item);
        }
    };
  
    const handleCardClickStop = (e) => {
        e?.stopPropagation?.();
        handleCardClick(e);
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
                                <img src={avatarSrc} alt="" className={styles.avatar_image} />
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
                    {hasImage ? (
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
                                draggable={false}
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
