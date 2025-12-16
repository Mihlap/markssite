import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CompanyHistory.module.scss';
import { fetchCompanyHistory } from '../../store/Slice/companyHistorySlice';
import cityVector from '../icons/cityVector.svg';

gsap.registerPlugin(ScrollTrigger);

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function CompanyHistory() {
  const dispatch = useDispatch();
  const historyItems = useSelector((state) => state.companyHistory.items || []);
  const loading = useSelector((state) => state.companyHistory.loading);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const subtitleLine1Ref = useRef(null);
  const subtitleLine2Ref = useRef(null);
  const historyListRef = useRef(null);

  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const visibleItems = useMemo(
    () =>
      [...historyItems]
        .filter((item) => !item.hidden)
        .sort((a, b) => {
          const ao = a.order ?? 0;
          const bo = b.order ?? 0;
          if (ao !== bo) return ao - bo;
          return (b.year ?? 0) - (a.year ?? 0);
        }),
    [historyItems]
  );

  useEffect(() => {
    dispatch(fetchCompanyHistory());
  }, [dispatch]);

  useEffect(() => {
    if (!inView) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Анимация заголовка "История"
    if (titleRef.current) {
      tl.from(titleRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.8,
      });
    }

    // Анимация "MARKS GROUP" с линии справа
    if (subtitleRef.current) {
      tl.from(
        subtitleRef.current,
        {
          x: 100,
          opacity: 0,
          duration: 0.8,
        },
        '-=0.4'
      );
    }

    // Анимация первой строки подзаголовка слева
    if (subtitleLine1Ref.current) {
      tl.from(
        subtitleLine1Ref.current,
        {
          x: -150,
          opacity: 0,
          duration: 0.8,
        },
        '-=0.4'
      );
    }

    // Анимация второй строки подзаголовка справа
    if (subtitleLine2Ref.current) {
      tl.from(
        subtitleLine2Ref.current,
        {
          x: 150,
          opacity: 0,
          duration: 0.8,
        },
        '-=0.4'
      );
    }

    // Анимация списка истории
    if (historyListRef.current && visibleItems.length > 0) {
      const items = historyListRef.current.children;
      tl.from(
        items,
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
        },
        '-=0.2'
      );
    }

    return () => {
      tl.kill();
    };
  }, [inView, visibleItems.length]);

  return (
    <div id="history" ref={ref} className={styles.history_section}>
      <div className={styles.history_background}>
        <img src={cityVector} alt="" className={styles.background_illustration} />
      </div>

      <div className={styles.history_content}>
        <div className={styles.history_header}>
          <h1 ref={titleRef} className={styles.history_title}>
            История
          </h1>
          <div ref={subtitleRef} className={styles.history_subtitle}>
            <span className={styles.marks_group}>MARKS GROUP</span>
            <span className={styles.subtitle_line}></span>
          </div>
          <div className={styles.history_description}>
            <p ref={subtitleLine1Ref} className={styles.description_line}>
              это история людей, которые не боятся вызовов
            </p>
            <p ref={subtitleLine2Ref} className={styles.description_line}>
              и всегда готовы к новым победам
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : visibleItems.length > 0 ? (
          <div ref={historyListRef} className={styles.history_list}>
            {visibleItems.map((item) => (
              <div key={item.id} className={styles.history_item}>
                <div className={styles.history_year}>{item.year}</div>
                <div className={styles.history_item_content}>
                  <h3 className={styles.history_item_title}>{item.title}</h3>
                  {item.description && (
                    <div
                      className={styles.history_item_description}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                  {item.img && (
                    <div className={styles.history_item_image}>
                      <img
                        src={item.img.includes('http') ? item.img : `${bucket_url}/${item.img}`}
                        alt={item.title}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty_history}>История компании пока пуста</div>
        )}
      </div>
    </div>
  );
}

