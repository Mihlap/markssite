import styles from './CompanyHistoryHeader.module.scss';

const DESCRIPTION_DESKTOP_LINE_1 =
  'это история людей, которые не боятся вызовов';
const DESCRIPTION_DESKTOP_LINE_2 = 'и всегда готовы к новым победам';

const DESCRIPTION_MOBILE_LINE_1 = 'это история людей, которые не боятся';
const DESCRIPTION_MOBILE_LINE_2 =
  'вызовов и всегда готовы к новым победам';

const DESCRIPTION_TABLET_LINE_1 =
  'это история людей, которые не боятся вызовов';
const DESCRIPTION_TABLET_LINE_2 = 'и всегда готовы к новым победам';

export default function CompanyHistoryHeader({
  isDesktop,
  historyHeaderRef,
  backgroundRef,
  titleRef,
  subtitleRef,
  marksGroupRef,
  subtitleLineRef,
  subtitleLine1Ref,
  subtitleLine2Ref,
  cityVector,
}) {
  const isStrictMobile =
    typeof window !== 'undefined' ? window.innerWidth <= 767 : false;

  return (
    <div ref={historyHeaderRef} className={styles.history_header}>
      <div ref={backgroundRef} className={styles.history_background}>
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
        {isDesktop ? (
          <>
            <p ref={subtitleLine1Ref} className={styles.description_line}>
              {DESCRIPTION_DESKTOP_LINE_1}
            </p>
            <p ref={subtitleLine2Ref} className={styles.description_line}>
              {DESCRIPTION_DESKTOP_LINE_2}
            </p>
          </>
        ) : isStrictMobile ? (
          <p ref={subtitleLine1Ref} className={styles.description_line}>
            {DESCRIPTION_MOBILE_LINE_1}
            <br />
            {DESCRIPTION_MOBILE_LINE_2}
          </p>
        ) : (
          <p ref={subtitleLine1Ref} className={styles.description_line}>
            {DESCRIPTION_TABLET_LINE_1}
            <br />
            {DESCRIPTION_TABLET_LINE_2}
          </p>
        )}
      </div>
    </div>
  );
}