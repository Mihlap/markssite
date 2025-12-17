import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import styles from './CompanyHistory.module.scss';
import { fetchCompanyHistory } from '../../store/Slice/companyHistorySlice';
import cityVector from '../icons/cityVector.svg';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function CompanyHistory() {
  const dispatch = useDispatch();
  const historyItems = useSelector((state) => state.companyHistory.items || []);
  const loading = useSelector((state) => state.companyHistory.loading);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const subtitleLineRef = useRef(null);
  const marksGroupRef = useRef(null);
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
   
    const setAnimationVariables = () => {
      if (!marksGroupRef.current || !titleRef.current || !subtitleLine1Ref.current) return;
    
      const elements = [titleRef.current, marksGroupRef.current, subtitleLineRef.current, subtitleLine1Ref.current, subtitleLine2Ref.current];
      elements.forEach(el => {
        if (el) el.style.transform = 'none';
      });
  
      const titleRect = titleRef.current.getBoundingClientRect();
      const marksRect = marksGroupRef.current.getBoundingClientRect();
      const titleNaturalCenterX = titleRect.left + titleRect.width / 2;

      let titleTargetCenterX;
      if (window.innerWidth >= 1600) {
        titleTargetCenterX = marksRect.left + marksRect.width / 2;
      } else {
        titleTargetCenterX = marksRect.right - titleRect.width / 2;
      }
      const titleOffsetX = titleTargetCenterX - titleNaturalCenterX;
    
      const line1Rect = subtitleLine1Ref.current.getBoundingClientRect();
      const lineNaturalLeft = line1Rect.left;

      let descTargetLeft;
      if (window.innerWidth >= 1600) {
        descTargetLeft = marksRect.left + marksRect.width / 2;
      } else {
        descTargetLeft = marksRect.left + marksRect.width * 0.65;
      }
      const descOffsetX = descTargetLeft - lineNaturalLeft;
  
      document.documentElement.style.setProperty('--title-offset-x', `${titleOffsetX}px`);
      document.documentElement.style.setProperty('--desc-offset-x', `${descOffsetX}px`);
   
      requestAnimationFrame(() => {
        if (titleRef.current) titleRef.current.classList.add(styles.animate);
        if (marksGroupRef.current) marksGroupRef.current.classList.add(styles.animate);
        if (subtitleLineRef.current) subtitleLineRef.current.classList.add(styles.animate);
        if (subtitleLine1Ref.current) subtitleLine1Ref.current.classList.add(styles.animate);
        if (subtitleLine2Ref.current) subtitleLine2Ref.current.classList.add(styles.animate);

        if (historyListRef.current && visibleItems.length > 0) {
          Array.from(historyListRef.current.children).forEach((item, index) => {
            setTimeout(() => {
              item.classList.add(styles.animate);
            }, 2500 + index * 150);
          });
        }
      });
    };

    setTimeout(setAnimationVariables, 100);

    const handleResize = () => {
      setAnimationVariables();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
            <span ref={marksGroupRef} className={styles.marks_group}>MARKS GROUP</span>
            <span ref={subtitleLineRef} className={styles.subtitle_line}></span>
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
          <div className={styles.empty_history}>История компании обновляется</div>
        )}
      </div>
    </div>
  );
}

