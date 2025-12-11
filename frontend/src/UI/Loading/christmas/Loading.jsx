import { circles } from './const/circle';
import logo from './images/logo.svg';
import logo2 from './images/logo-g.svg';
import styles from './styles.module.scss';
import LoadingProgress from '../../../Loading/LoadingProgress';

const Loading = ({ isReady = false, onFinish }) => {
  return (
    <section className={styles['loading-container']}>
      <span className={styles['logo']}>
        <img src={logo} alt="логотип компании маркс групп" />
        <div className={styles['logo-wrap']}>
          <img src={logo2} alt="логотип генеральное проектирование " />
        </div>
      </span>
      {circles?.map((circle) => (
        <div key={circle.id} className={styles['circle-wrap']}>
          <div className={styles[`${circle.classStyle}`]}>
            <img src={circle.src} alt={circle.alt} />
          </div>
        </div>
      ))}
      {['circle-white--1', 'circle-white--2', 'circle-white--3'].map((cls, index) => (
        <div key={`white-${index}`} className={`${styles['circle-white']} ${styles[cls]}`} />
      ))}
      <div className={styles['progres-bar']}>
        <LoadingProgress isReady={isReady} onFinish={onFinish} />
      </div>
    </section>
  );
};

export default Loading;
