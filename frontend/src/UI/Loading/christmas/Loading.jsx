import { useEffect, useRef } from 'react';
import Snowfall from '../Snow/Snowfall';
import { circles } from './const/circle';
import logoMobile from './images/logo-phone.svg';
import logoTablet from './images/logo-table.svg';
import logoDesktop from './images/logo.svg';
import logoDesktopLarge from './images/logo-big.svg';
import logoDecMobile from './images/logo-desc-phone.svg';
import logoDecTablet from './images/logo-desc-table.svg';
import logoDecDesktop from './images/logo-desc.svg';
import logoDecDesktopLarge from './images/logo-desc-big.svg';
import styles from './styles.module.scss';
import LoadingProgress from '../../../Loading/LoadingProgress';

const Loading = ({ isReady = false, onFinish }) => {
  const MIN_LOADER_DURATION_MS = 3500;
  const startTimeRef = useRef(Date.now());
  const finishTimeoutRef = useRef(null);
  const finishRequestedRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();

    return () => {
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
      }
    };
  }, []);

  // Держим лоудер на экране минимум 3.5s, чтобы анимации успели завершиться
  const handleFinishRequest = () => {
    if (finishRequestedRef.current) return;
    finishRequestedRef.current = true;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = MIN_LOADER_DURATION_MS - elapsed;

    if (remaining > 0) {
      finishTimeoutRef.current = setTimeout(() => {
        onFinish?.();
      }, remaining);
    } else {
      onFinish?.();
    }
  };

  return (
    <Snowfall>
      <section className={styles['loading-container']}>
        <div className={styles['logo']}>
          <div className={styles['logo-wrap']}>
            <div className={styles['ball-one']} />

            <picture className={styles['logo__image']}>
              <source media="(min-width: 2560px)" srcSet={logoDesktopLarge} />
              <source media="(min-width: 1440px)" srcSet={logoDesktop} />
              <source media="(min-width: 768px)" srcSet={logoTablet} />
              <img className={styles['logo-main']} src={logoMobile} alt="логотип" />
            </picture>

            <div className={styles['ball-two']} />
            <div className={styles['ball-three']} />
          </div>
          <div className={styles['logo-decoration']}>
            <picture>
              <source media="(min-width: 2560px)" srcSet={logoDecDesktopLarge} />
              <source media="(min-width: 1440px)" srcSet={logoDecDesktop} />
              <source media="(min-width: 768px)" srcSet={logoDecTablet} />
              <img className={styles['logo-dec']} src={logoDecMobile} alt="логотип генеральное проектирование " />
            </picture>
          </div>
        </div>

        {circles.map((circle) => (
          <div key={circle.id} className={`${styles['circle-wrap']} ${styles[circle.wrapClass]}`}>
            <div className={styles.circle}>
              <img src={circle.src} alt={circle.alt} />
            </div>
          </div>
        ))}
        <div className={styles['progres-bar']}>
          {
            <LoadingProgress
              isReady={isReady}
              onFinish={handleFinishRequest}
            />
          }
        </div>
      </section>
    </Snowfall>
  );
};

export default Loading;
