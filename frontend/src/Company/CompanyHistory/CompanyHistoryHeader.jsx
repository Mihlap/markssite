import styles from './CompanyHistoryHeader.module.scss';

export default function CompanyHistoryHeader({
  historyHeaderRef,
  titleRef,
  subtitleRef,
  marksGroupRef,
  subtitleLineRef,
  subtitleLine1Ref,
  subtitleLine2Ref,
  cityVector,
}) {
  return (
    <div ref={historyHeaderRef} className={styles.history_header}>
      <div className={styles.history_background}>
        <img src={cityVector} alt="" className={styles.background_illustration} />
      </div>
      <h1 ref={titleRef} className={styles.history_title}>
        История
      </h1>
      <div ref={subtitleRef} className={styles.history_subtitle}>
        <span ref={marksGroupRef} className={styles.marks_group}>
          MARKS GROUP
        </span>
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
  );
}