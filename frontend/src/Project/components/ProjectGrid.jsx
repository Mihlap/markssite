import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Item from './Item';
import styles from '../styles/ProjectGrid.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;
const SKELETON_COUNT = 6;

function EmptyState({ icon, message }) {
  return (
    <div className={styles.empty_state}>
      <div className={styles.empty_state_icon}>{icon}</div>
      <p className={styles.empty_state_text}>{message}</p>
    </div>
  );
}

function SkeletonItem() {
  return (
    <div>
      <div className={styles.skeleton_img} />
      <div className={styles.skeleton_content}>
        <div className={styles.skeleton_info}>
          <div className={`${styles.skeleton_line} ${styles.skeleton_title}`} />
          <div className={`${styles.skeleton_line} ${styles.skeleton_title_short}`} />
          <div className={`${styles.skeleton_line} ${styles.skeleton_meta}`} />
        </div>
        <div className={styles.skeleton_tags}>
          <div className={styles.skeleton_tag} />
          <div className={styles.skeleton_tag} />
        </div>
      </div>
    </div>
  );
}

export default function ProjectGrid({ projects, isPending, isError, isFetchingNextPage, fetchNextPage, hasNextPage }) {
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <section className={styles.list}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <SkeletonItem key={i} />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
        message="Не удалось загрузить проекты. Попробуйте обновить страницу."
      />
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
        message="Проекты не найдены."
      />
    );
  }

  return (
    <>
      <section className={styles.list}>
        {projects.map((project) => {
          if (!project) return null;
          const photoName = project.imageProject;
          const photoSrc = photoName?.includes('https')
            ? photoName
            : `${bucket_url}/images/imageAdd/${photoName ?? ''}`;
          return <Item key={project.id} project={project} photoSrc={photoSrc} />;
        })}
      </section>
      <div ref={sentinelRef} />
      {isFetchingNextPage && <p className={styles.notification}>Загрузка...</p>}
    </>
  );
}
