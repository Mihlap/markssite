import { memo } from "react";

function SubmitButtons({ styles, closeModal }) {
  return (
    <div className={styles.form_container__button_block}>
      <button className={styles.form_container__button_save} type="submit">
      </button>
      <button className={styles.form_container__button_cancel} type="button" onClick={closeModal}>
      </button>
    </div>
  );
}

export default memo(SubmitButtons);
