import { circles } from './const/circle';
import styles from './styles.module.scss';

const Loading = () => {
  return (
    <section className={styles['loading-container']}>
      <div className={styles['circles']}>
        {circles?.map((circle) => (
          <div className={styles[`${circle.classStyle}`]} key={circle.id}>
            <img src={circle.src} alt={circle.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
