import { memo, useCallback } from 'react';
import styles from '../../style/style-card.module.scss';

import FormAddHistory from './FormAddHistory';
import FormEditHistory from './FormEditHistory';

function HistoryModalManager({
  isModalOpenHistory,
  setIsModalOpenHistory,
  editHistoryData,
  setEditHistoryData,
  modalBlockHeight,
}) {
  const handleClose = useCallback(() => {
    setIsModalOpenHistory(false);
    if (setEditHistoryData) setEditHistoryData(null);
  }, [setIsModalOpenHistory, setEditHistoryData]);

  if (!isModalOpenHistory) return null;

  return (
    <div className={styles.card_components_admin__modal_container}>
      <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
        {editHistoryData ? (
          <FormEditHistory initial={editHistoryData} onClose={handleClose} />
        ) : (
          <FormAddHistory onClose={handleClose} />
        )}

        <button className={styles.card_components_admin__close_button} onClick={handleClose} />
      </div>
    </div>
  );
}

export default memo(HistoryModalManager);
