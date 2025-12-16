import styles from './LoadingNew.module.css';
import logo from '../icons/logowhite.svg';
import LoadingProgress from './LoadingProgress';

export default function LoadingNew({ isReady = false, onFinish }) {
  return (
    <div className={styles.contentLoaderContainer}>
      <div className={styles.contentLoaderCircles}>
        <div className={`${styles.ellipseFirst} ${styles.ellipseAll}`}></div>
        <div className={`${styles.ellipseSecond} ${styles.ellipseAll}`}></div>
        <div className={`${styles.ellipseThird} ${styles.ellipseAll}`}></div>
        <div className={`${styles.ellipseFour} ${styles.ellipseAll}`}></div>
      </div>
      <div className={styles.contentLoaderBlock}>
        <div className={styles.conentLoaderLogo}>
          <img className={styles.itemLoaderLogo} src={logo} alt="marksgroup" />
          <div className={styles.contentLoaderSubtitle}>ГЕНЕРАЛЬНОЕ&nbsp;ПРОЕКТИРОВАНИЕ</div>
        </div>
        <LoadingProgress isReady={isReady} onFinish={onFinish} />
      </div>
    </div>
  );
}
