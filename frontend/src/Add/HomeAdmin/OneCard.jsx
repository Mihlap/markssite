import React from 'react'
import styles from "./HomeAdmin.module.scss";

export default function OneCard({ article, handleArticleLeftDelete }) {
  return (
    <div className={styles.home_admin_section__id_block} key={article.id}>
      {article.IdArticle}
      <button
        className={styles.home_admin_section__button_del}
        onClick={() => handleArticleLeftDelete(article.IdArticle)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9 9L15 15"
            stroke="#1D2E43"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 9L9 15"
            stroke="#1D2E43"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
