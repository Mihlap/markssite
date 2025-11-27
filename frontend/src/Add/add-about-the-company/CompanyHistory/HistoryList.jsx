import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../style/style-card.module.scss';

import HistoryItem from './HistoryItem';

import {
  updateHistoryOrderLocally,
  updateHistoryOrder,
  toggleHistoryVisibility,
  deleteHistoryItem,
} from '../../../store/Slice/companyHistorySlice';

export default function HistoryList({ user, setIsModalOpenHistory, setEditHistoryData }) {
  const dispatch = useDispatch();
  const yearsFromStore = useSelector((state) => state.companyHistory?.items || []);

  const years = useMemo(
    () =>
      [...yearsFromStore].sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        return (b.year ?? 0) - (a.year ?? 0);
      }),
    [yearsFromStore]
  );

  const [draggedItem, setDraggedItem] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({});

  const handleDragStart = useCallback(
    (e, index) => {
      const item = years[index];
      setDraggedItem(item);
      try {
        e.dataTransfer.setData('text/plain', String(item.id));
      } catch (_) {}
      e.dataTransfer.effectAllowed = 'move';
    },
    [years]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch (_) {}
  }, []);

  const handleDrop = useCallback(
    async (e, index) => {
      e.preventDefault();
      if (!draggedItem) return;

      const draggedIndex = years.findIndex((y) => y.id === draggedItem.id);
      if (draggedIndex === index) return;

      const updated = [...years];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, removed);

      const reindexed = updated.map((y, i) => ({ ...y, order: i }));

      dispatch(updateHistoryOrderLocally(reindexed));

      try {
        await dispatch(updateHistoryOrder(reindexed)).unwrap();
      } finally {
        setDraggedItem(null);
      }
    },
    [dispatch, years, draggedItem]
  );

  const handleLookClick = useCallback(
    (id) => {
      const year = years.find((y) => y.id === id);
      if (year) dispatch(toggleHistoryVisibility({ id, hidden: !year.hidden }));
    },
    [dispatch, years]
  );

  const handleEditClick = useCallback(
    (item) => {
      setEditHistoryData(item);
      setIsModalOpenHistory(true);
    },
    [setEditHistoryData, setIsModalOpenHistory]
  );

  const handleDeleteModalOpen = useCallback((id) => {
    setDeleteModalState((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleDeleteModalClose = useCallback((id) => {
    setDeleteModalState((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleFormDelete = useCallback(
    (id) => {
      dispatch(deleteHistoryItem(id));
      handleDeleteModalClose(id);
    },
    [dispatch, handleDeleteModalClose]
  );

  if (!years.length) {
    return <div className={styles.card_components_admin__null_history}>История компании пока не добавлена</div>;
  }

  return (
    <div className={styles.card_components_admin__block__history} role="list">
      {years.map((el, index) => (
        <HistoryItem
          key={el.id}
          el={el}
          index={index}
          user={user}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleLookClick={handleLookClick}
          handleEditClick={handleEditClick}
          deleteModalState={deleteModalState}
          handleDeleteModalOpen={handleDeleteModalOpen}
          handleDeleteModalClose={handleDeleteModalClose}
          handleFormDelete={handleFormDelete}
        />
      ))}
    </div>
  );
}
