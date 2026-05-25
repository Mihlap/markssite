import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Item from './Item';
import styles from '../styles/Project.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function ProjectGrid({ projects, isPending, isError, isFetchingNextPage, fetchNextPage, hasNextPage }) {
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isPending) {
    return <p className={styles.notification}>Проекты загружаются.</p>;
  }

  if (isError) {
    return <p className={styles.notification}>Не удалось загрузить проекты. Попробуйте обновить страницу.</p>;
  }

  if (projects.length === 0) {
    return <p className={styles.notification}>Проекты не найдены.</p>;
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
