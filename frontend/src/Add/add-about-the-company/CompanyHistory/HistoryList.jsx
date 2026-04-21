import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import historyStyles from './CompanyHistory.module.scss';

import HistoryItem from './HistoryItem';
import ChevronDown from '../../icon/chevron-down.svg';

import {
  updateHistoryOrderLocally,
  updateHistoryOrder,
  toggleHistoryVisibility,
  deleteHistoryItem,
  fetchCompanyHistory,
} from '../../../store/Slice/companyHistorySlice';

function HistoryList({ user, setIsModalOpenHistory, setEditHistoryData }) {
  const dispatch = useDispatch();
  const yearsFromStore = useSelector((state) => state.companyHistory.items || []);

  const canDrag = useMemo(() => {
    const uname = String(user?.name ?? user?.userName ?? '').trim();
    return uname !== 'hr778';
  }, [user]);

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
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef(null);
  const [listHeights, setListHeights] = useState({ full: 0, collapsed: 0 });

  const measureHeights = useCallback(() => {
    if (!listRef.current) return;
    const container = listRef.current;
    const children = Array.from(container.children);
    const computed = window.getComputedStyle(container);
    const gapValue = parseFloat(computed.rowGap || computed.gap || '0') || 0;
    const paddingTop = parseFloat(computed.paddingTop || '0') || 0;
    const paddingBottom = parseFloat(computed.paddingBottom || '0') || 0;
    const full = container.scrollHeight;

    if (!children.length) {
      setListHeights({ full: 0, collapsed: 0 });
      return;
    }

    const visibleCount = Math.min(4, children.length);
    const visibleItems = children.slice(children.length - visibleCount);
    const baseHeight = visibleItems.reduce((acc, el) => acc + el.offsetHeight, 0);
    const totalGap = Math.max(visibleCount - 1, 0) * gapValue;
    const paddingTotal = paddingTop + paddingBottom;
    const safetyOffset = 0;

    setListHeights({
      full,
      collapsed: Math.min(full, baseHeight + totalGap + paddingTotal + safetyOffset),
    });
  }, []);

  useLayoutEffect(() => {
    measureHeights();
  }, [measureHeights]);

  useEffect(() => {
    measureHeights();
  }, [years, measureHeights]);

  useEffect(() => {
    const handleResize = () => measureHeights();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureHeights]);

  const handleDragStart = useCallback(
    (e, index) => {
      if (!canDrag) return;
      const item = years[index];
      setDraggedItem(item);
      try {
        e.dataTransfer.setData('text/plain', String(item.id));
      } catch (_) { }
      e.dataTransfer.effectAllowed = 'move';
    },
    [years, canDrag]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch (_) { }
  }, []);

  const handleDrop = useCallback(
    async (e, index) => {
      e.preventDefault();
      if (!canDrag || !draggedItem) return;

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
    [dispatch, years, draggedItem, canDrag]
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
    async (id) => {
      try {
        await dispatch(deleteHistoryItem(id)).unwrap();
        await dispatch(fetchCompanyHistory()).unwrap();
        handleDeleteModalClose(id);
      } catch (e) {
        console.error('Ошибка удаления записи истории:', e);
      }
    },
    [dispatch, handleDeleteModalClose]
  );

  if (!years.length) {
    return <div className={historyStyles.nullHistory}>История компании пока не добавлена</div>;
    //  return (
    //    <div className={historyStyles.nullHistory} style={{ fontSize: '1.5rem' }}>
    //      Прямо сейчас мы создаём историю
    //    </div>
    //  ); // временно
  }

  const shouldClamp = years.length > 4 && listHeights.full > 0;
  const targetHeight = showAll ? listHeights.full : listHeights.collapsed || listHeights.full;

  return (
    <div className={historyStyles.blockHistory}>
      <div
        ref={listRef}
        className={historyStyles.itemsWrapper}
        role="list"
        style={
          shouldClamp && targetHeight
            ? {
              maxHeight: `${targetHeight}px`,
              overflow: 'hidden',
              transition: 'max-height 0.45s ease-in-out',
            }
            : undefined
        }>
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
            isDeleteOpen={!!deleteModalState[el.id]}
            handleDeleteModalOpen={handleDeleteModalOpen}
            handleDeleteModalClose={handleDeleteModalClose}
            handleFormDelete={handleFormDelete}
          />
        ))}
      </div>
      {years.length > 4 && (
        <div className={historyStyles.toggleWrapper}>
          <button
            type="button"
            className={historyStyles.toggleButton}
            onClick={() => setShowAll((prev) => !prev)}>
            <span>{showAll ? 'Скрыть все' : 'Смотреть все'}</span>
            <img
              src={ChevronDown}
              alt=""
              aria-hidden="true"
              className={`${historyStyles.toggleIcon} ${showAll ? historyStyles.toggleIconRotated : ''}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(HistoryList);
