import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../style/style-card.module.scss';

import FormAddHistory from './FormAddHistory';
import FormEditHistory from './FormEditHistory';

import { createHistoryItem, fetchCompanyHistory } from '../../../store/Slice/companyHistorySlice';

export default function HistoryModalManager({
  isModalOpenHistory,
  setIsModalOpenHistory,
  editHistoryData,
  setEditHistoryData,
  modalBlockHeight,
}) {
  const dispatch = useDispatch();

  const handleAddHistory = useCallback(
    async (formData) => {
      try {
        await dispatch(createHistoryItem(formData)).unwrap();
        dispatch(fetchCompanyHistory());
        setIsModalOpenHistory(false);
        if (setEditHistoryData) setEditHistoryData(null);
      } catch (error) {
        console.error('Ошибка при добавлении записи истории:', error);
      }
    },
    [dispatch, setIsModalOpenHistory, setEditHistoryData]
  );

  if (!isModalOpenHistory) return null;

  return (
    <div className={styles.card_components_admin__modal_container}>
      <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
        {editHistoryData ? (
          <FormEditHistory
            initial={editHistoryData}
            setIsModalOpenHistory={setIsModalOpenHistory}
            setEditHistoryData={setEditHistoryData}
          />
        ) : (
          <FormAddHistory onSubmit={handleAddHistory} setIsModalOpenHistory={setIsModalOpenHistory} />
        )}

        <button
          className={styles.card_components_admin__close_button}
          onClick={() => {
            setIsModalOpenHistory(false);
            if (setEditHistoryData) setEditHistoryData(null);
          }}
        />
      </div>
    </div>
  );
}
