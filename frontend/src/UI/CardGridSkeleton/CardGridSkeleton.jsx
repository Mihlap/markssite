import styles from './CardGridSkeleton.module.css';

export default function CardGridSkeleton({ count = 6, className = '' }) {
  return (
    <div className={`${styles.grid} ${className}`.trim()} aria-busy="true" aria-label="Загрузка">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.card} aria-hidden="true">
          <div className={styles.image} />
          <div className={styles.content}>
            <div className={`${styles.line} ${styles.title}`} />
            <div className={`${styles.line} ${styles.titleShort}`} />
            <div className={`${styles.line} ${styles.meta}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
