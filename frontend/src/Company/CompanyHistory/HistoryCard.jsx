import styles from './HistoryCard.module.scss';

const bucket_url = (process.env.REACT_APP_S3_BUCKET_URL || '').replace(/\/+$/, '');

const isHttp = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);
const toSrc = (raw) => {
    if (!raw) return '';
    if (isHttp(raw)) return raw;
    if (!bucket_url) return String(raw);
    return `${bucket_url}/${String(raw).replace(/^\/+/, '')}`;
};

export default function HistoryCard({ item, variant = 1, isBottom = false }) {
    const previewImgSrc = item?.previewImageUrl ? toSrc(item.previewImageUrl) : toSrc(item?.img);
    const hasImage = variant === 1 && !!previewImgSrc;

    const avatarSrc = item?.avatarUrl ? toSrc(item.avatarUrl) : toSrc(item?.avatar);

    return (
        <div
            className={`${styles.history_card} ${hasImage ? styles.variant1 : styles.variant2} ${isBottom ? styles.bottom_card : ''
                }`}
        >
            {hasImage ? (
                <div className={styles.card_image}>
                    <img src={previewImgSrc} alt={item?.title || ''} />
                </div>
            ) : null}

            <div className={styles.card_content}>
                <div className={styles.card_avatar}>
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="" className={styles.avatar_image} />
                    ) : (
                        <div className={styles.avatar_placeholder} />
                    )}
                </div>

                <div className={styles.card_text}>
                    <div className={styles.card_title} dangerouslySetInnerHTML={{ __html: item?.description || '' }} />
                    <p className={styles.card_link}>Открыть хронику...</p>
                </div>
            </div>

            {!hasImage ? <div className={styles.card_image_placeholder} aria-hidden="true" /> : null}
        </div>
    );
}
