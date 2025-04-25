import React, { useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJournals } from '../../store/Slice/journalSlice';
import styles from './ArticleJournalPage.module.scss';
import 'katex/dist/katex.min.css';
import AllArticlesButton from '../../UI/ButtonsArticles/AllArticlesButton';
import ArticleTableOfContents from './ArticleTableOfContents';
import ArticleAuthors from './ArticleAuthors';
import { shareToVK, shareToTelegram, shareToWhatsAppJournal } from './utils';
import next from '../../icons/next.svg';
import previous from '../../icons/previous.svg';
import SkeletonArticle from './SkeletonArticle';
import MarkdownContentRenderer from '../../UI/MarkdownContentRenderer/MarkdownContentRenderer';

function ArticleJournalPage({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { state } = useLocation();
  const { journal: stateJournal, targetChapterSlug } = state || {};
  const journals = useSelector((s) => s.journal.journals);
  const loading = useSelector((s) => s.journal.loading);

  useEffect(() => {
    if (journals.length === 0) {
      dispatch(fetchJournals());
    }
  }, [dispatch, journals.length]);

  const journalToUse = useMemo(() => {
    if (stateJournal) return stateJournal;
    return journals.find((j) => String(j.id) === String(id));
  }, [stateJournal, journals, id]);

  const { previousArticle, nextArticle } = useMemo(() => {
    const len = journals.length;
    const idx = journals.findIndex((j) => j.id === journalToUse?.id);
    if (idx === -1 || len < 2) {
      return { previousArticle: null, nextArticle: null };
    }
    return {
      previousArticle: journals[(idx - 1 + len) % len],
      nextArticle: journals[(idx + 1) % len],
    };
  }, [journals, journalToUse]);

  const mdContent = journalToUse?.markdown_content ?? '';

  useEffect(() => {
    if (!journalToUse) return;
    if (targetChapterSlug) {
      const el = document.getElementById(targetChapterSlug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${targetChapterSlug}`);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [journalToUse, targetChapterSlug]);

  if (loading || !journalToUse) {
    return <SkeletonArticle />;
  }

  return (
    <div className={styles.main_article_card}>
      <div className={styles.main_article_card__fon}>
        <div className={styles.allButton_div}>
          <AllArticlesButton path="/journalPage" />
        </div>
        <div className={styles.left_title}>{journalToUse.title}</div>
        <div className={styles.authorsNames}>
          {journalToUse.authors?.map((a, idx) => (
            <React.Fragment key={idx}>
              <span className={styles.authorName}>{a.name}</span>
              {idx < journalToUse.authors.length - 1 && <span className={styles.authorSeparator}>&nbsp;•&nbsp;</span>}
            </React.Fragment>
          ))}
        </div>
        <div className={styles.publication_date}>
          <span>{journalToUse.organizations?.[0]?.value ?? journalToUse.organizations?.[0]?.name}</span>
          {' • '}
          <span>{journalToUse.publication_date}</span>
        </div>
      </div>

      <div className={styles.articleLayout}>
        <div className={styles.sidebar}>
          <ArticleTableOfContents markdown={mdContent} activeSlug={targetChapterSlug} />
        </div>
        <div className={styles.wrapper}>
          <div className={styles.markdown_body}>
            <MarkdownContentRenderer markdown={mdContent} />
          </div>
          <div className={styles.share_article}>
            <div>Поделиться статьей</div>
            <div id="articles" className={styles.social_links_articleCard}>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToVK(journalToUse)}>
                <span className={styles.social_links_item} style={{ marginRight: '10px', color: '#FF7F6A' }}>
                  VK
                </span>
              </button>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToWhatsAppJournal(journalToUse)}>
                <span className={styles.social_links_item} style={{ marginRight: '10px', color: '#FF7F6A' }}>
                  WA
                </span>
              </button>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToTelegram(journalToUse)}>
                <span className={styles.social_links_item} style={{ color: '#FF7F6A' }}>
                  TG
                </span>
              </button>
            </div>
          </div>
          <div className={styles.button_article_articleCard}>
            {previousArticle && (
              <Link
                to={`/journal/${previousArticle.id}`}
                className={styles.button_article_link_articleCard1}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className={styles.previous_svg_articleCard}>
                  <img src={previous} alt="«Предыдущая»" />
                  <span className={styles.previous__span_articleCard}>{previousArticle.title}</span>
                </div>
              </Link>
            )}
            {nextArticle && (
              <Link
                to={`/journal/${nextArticle.id}`}
                className={styles.button_article_link_articleCard2}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className={styles.next_svg_articleCard}>
                  <span className={styles.next__span_articleCard}>{nextArticle.title}</span>
                  <img src={next} alt="«Следующая»" />
                </div>
              </Link>
            )}
          </div>
        </div>
        {mdContent.trim().length > 0 && (
          <div className={styles.sidebar}>
            <ArticleAuthors authors={journalToUse.authors} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleJournalPage;
