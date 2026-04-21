import { memo, useCallback, useRef } from 'react';
import styles from '../../style/style-card.module.scss';

import FormAddHistory from './FormAddEditHistory/FormAddHistory';
import FormEditHistory from './FormAddEditHistory/FormEditHistory';

function HistoryModalManager({
  isModalOpenHistory,
  setIsModalOpenHistory,
  editHistoryData,
  setEditHistoryData,
  modalBlockHeight,
}) {
  const closeGuardRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsModalOpenHistory(false);
    if (setEditHistoryData) setEditHistoryData(null);
  }, [setIsModalOpenHistory, setEditHistoryData]);

  const handleCloseClick = useCallback(() => {
    if (closeGuardRef.current) {
      closeGuardRef.current();
    } else {
      handleClose();
    }
  }, [handleClose]);

  if (!isModalOpenHistory) return null;

  return (
    <div className={styles.card_components_admin__modal_container}>
      <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
        {editHistoryData ? (
          <FormEditHistory
            initial={editHistoryData}
            onClose={handleClose}
            registerCloseGuard={(fn) => (closeGuardRef.current = fn)}
          />
        ) : (
          <FormAddHistory
            onClose={handleClose}
            registerCloseGuard={(fn) => (closeGuardRef.current = fn)}
          />
        )}

        <button className={styles.card_components_admin__close_button} onClick={handleCloseClick} />
      </div>
    </div>
  );
}

export default memo(HistoryModalManager);
