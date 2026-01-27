import styles from './HistoryCard.module.scss';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function HistoryCard({ item, variant = 1, isBottom = false }) {
    const hasImage = variant === 1 && item.img;

    return (
        <div className={`${styles.history_card} ${hasImage ? styles.variant1 : styles.variant2} ${isBottom ? styles.bottom_card : ''}`}>
            {hasImage ? (
                <div className={styles.card_image}>
                    <img
                        src={item.img.includes('http') ? item.img : `${bucket_url}/${item.img}`}
                        alt={item.title}
                    />
                </div>
            ) : null}

            <div className={styles.card_content}>
                <div className={styles.card_avatar}>
                    {item.avatar ? (
                        <img
                            src={item.avatar.includes('http') ? item.avatar : `${bucket_url}/${item.avatar}`}
                            alt=""
                            className={styles.avatar_image}
                        />
                    ) : (
                        <div className={styles.avatar_placeholder}></div>
                    )}
                </div>
                <div className={styles.card_text}>
                    <div className={styles.card_title} dangerouslySetInnerHTML={{ __html: item.description }} />
                    <p className={styles.card_link}>Открыть хронику...</p>
                </div>
            </div>

            {!hasImage ? <div className={styles.card_image_placeholder} aria-hidden="true" /> : null}
        </div>
    );
}


