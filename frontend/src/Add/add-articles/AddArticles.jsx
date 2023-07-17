import React from 'react'
import styles from "./AddArticles.module.scss";

export default function AddArticles() {
  console.log("AddArticles component is rendered"); // временный console.log

  return (
    <section className={styles.articles_components_admin}>
      <div className={styles.articles_components_admin__title}>Публикации</div>
    </section>
  );
}
