import { useLocation, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import styles from './ArticleJournalPage.module.scss';
import 'katex/dist/katex.min.css';
import { useEffect } from 'react';

function ArticleJournalPage() {
  const { state } = useLocation();
  const { journal } = state || {};

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  if (!journal) return <div>Статья не найдена</div>;

  return (
    <div className={styles.main_article_card}>
      <div className={styles.wrapper}>
        <div className={styles.left_title}>{journal.title}</div>
        <div className={styles.title_text}>
          <strong>{journal.authors?.map((a) => a.name).join(', ')}</strong>
          <br />
          {journal.publication_date} • {journal.locations?.[0]?.name}
        </div>

        <ReactMarkdown
          children={journal.markdown_content}
          remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => <h1 className={styles.left_title} {...props} />,
            p: ({ node, ...props }) => <p className={styles.title_text} {...props} />,
            img: ({ node, ...props }) => <img className={styles.item_img} {...props} />,
            // Добавь другие теги по аналогии
          }}
        />
      </div>
    </div>
  );
}

export default ArticleJournalPage;
