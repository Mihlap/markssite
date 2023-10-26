import React from 'react';
import styles from "../../style/style-card.module.scss";
// import MiniLoading from './MiniLoading';

export default function Loading() {
  return (
    <div className={styles.card_components_admin__loading_section}>
      <div className={styles.card_components_admin__loading_list}>
        <div className={styles.card_components_admin__loading_item}>
          <div
            className={`${styles.card_components_admin__loading_img} ${styles.card_components_admin__gradient}`}
          >
            {/* <MiniLoading /> */}
          </div>
          <div
            className={`${styles.card_components_admin__loading_block_one} ${styles.card_components_admin__gradient}`}
          />
          <div
            className={`${styles.card_components_admin__loading_block_two} ${styles.card_components_admin__gradient}`}
          />
        </div>
        <div className={styles.card_components_admin__loading_item}>
          <div
            className={`${styles.card_components_admin__loading_img} ${styles.card_components_admin__gradient}`}
          >
            {/* <MiniLoading /> */}
          </div>
          <div
            className={`${styles.card_components_admin__loading_block_one} ${styles.card_components_admin__gradient}`}
          />
          <div
            className={`${styles.card_components_admin__loading_block_two} ${styles.card_components_admin__gradient}`}
          />
        </div>
        <div className={styles.card_components_admin__loading_item}>
          <div
            className={`${styles.card_components_admin__loading_img} ${styles.card_components_admin__gradient}`}
          >
            {/* <MiniLoading /> */}
          </div>
          <div
            className={`${styles.card_components_admin__loading_block_one} ${styles.card_components_admin__gradient}`}
          />
          <div
            className={`${styles.card_components_admin__loading_block_two} ${styles.card_components_admin__gradient}`}
          />
        </div>
        <div className={styles.card_components_admin__loading_item}>
          <div
            className={`${styles.card_components_admin__loading_img} ${styles.card_components_admin__gradient}`}
          >
            {/* <MiniLoading /> */}
          </div>
          <div
            className={`${styles.card_components_admin__loading_block_one} ${styles.card_components_admin__gradient}`}
          />
          <div
            className={`${styles.card_components_admin__loading_block_two} ${styles.card_components_admin__gradient}`}
          />
        </div>
      </div>
    </div>
  );
}
