import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import {
  fetchCompanyHistory,
  deleteHistoryItem,
  toggleHistoryVisibility,
  updateHistoryOrder,
  updateHistoryOrderLocally,
} from '../../../store/Slice/companyHistorySlice';
import { UiMarksButton, UiMarksDialog, UiMarksDeleteModal, UiMarksHeading } from '../../ui';
import { useAdminUser } from '../../hooks/useAdminUser';
import HistoryList from './HistoryList';
import HistoryForm from './HistoryForm';

export default function HistoryMain({ user }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.companyHistory.items);

  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [orderedItems, setOrderedItems] = useState([]);

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  const { canDelete, canAdd, canEdit, canDrag } = useAdminUser(user);

  useEffect(() => {
    dispatch(fetchCompanyHistory());
  }, [dispatch]);

  useEffect(() => {
    const sorted = [...(items || [])].sort((a, b) => {
      const ao = a.order ?? 0;
      const bo = b.order ?? 0;
      if (ao !== bo) return ao - bo;
      return (b.year ?? 0) - (a.year ?? 0);
    });
    setOrderedItems(sorted);
  }, [items]);

  const handleEdit = useCallback((el) => {
    setEditData(el);
    setIsOpen(true);
  }, []);

  const handleToggle = useCallback((el) => {
    dispatch(toggleHistoryVisibility({ id: el.id, hidden: !el.hidden }));
  }, [dispatch]);

  const handleDelete = useCallback((el) => {
    setDeleteTarget({ id: el.id, name: String(el.year) });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    dispatch(deleteHistoryItem(deleteTarget.id));
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  const handleDialogClose = useCallback(() => {
    if (isFormDirtyRef.current) {
      setShowExitWarning(true);
    } else {
      setIsOpen(false);
      setEditData(null);
      setIsFormLoading(false);
    }
  }, []);

  const handleForceClose = useCallback(() => {
    isFormDirtyRef.current = false;
    setShowExitWarning(false);
    setIsOpen(false);
    setEditData(null);
    setIsFormLoading(false);
    formRef.current?.resetForm();
  }, []);

  const handleDirtyChange = useCallback((dirty) => {
    isFormDirtyRef.current = dirty;
  }, []);

  const handleDragEnd = useCallback((result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;

    const next = Array.from(orderedItems);
    const [moved] = next.splice(source.index, 1);
    next.splice(destination.index, 0, moved);

    const reindexed = next.map((it, i) => ({ ...it, order: i }));
    dispatch(updateHistoryOrderLocally(reindexed));
    dispatch(updateHistoryOrder(reindexed.map(({ id, order }) => ({ id, order }))));
  }, [orderedItems, dispatch]);

  return (
    <>
      <UiMarksHeading size="3xl" pb="lg">
        История MARKS GROUP
      </UiMarksHeading>
      {canAdd && (
        <UiMarksButton defaultStyle="blue" size="large" icon onClick={() => setIsOpen(true)}>
          Добавить запись
        </UiMarksButton>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <HistoryList
          items={orderedItems}
          canDelete={canDelete}
          canEdit={canEdit}
          canDrag={canDrag}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </DragDropContext>
      <UiMarksDeleteModal
        isOpen={!!deleteTarget}
        title={
          <>
            Вы точно хотите удалить запись <strong>«{deleteTarget?.name}»</strong>?
          </>
        }
        description="Удалённую запись вернуть будет невозможно"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
      <UiMarksDialog
        isOpen={isOpen}
        onClose={handleDialogClose}
        title={editData ? 'Редактировать год' : 'Новый год'}
        isSaveDisabled={!isFormValid}
        onSave={() => document.getElementById('add-form-history')?.requestSubmit()}
        isLoading={isFormLoading}
        isExit={showExitWarning}
        onExitConfirm={handleForceClose}
        onExitCancel={() => setShowExitWarning(false)}
        nameSpinner="История">
        <HistoryForm
          ref={formRef}
          onValidityChange={setIsFormValid}
          onLoadingChange={setIsFormLoading}
          onDirtyChange={handleDirtyChange}
          editData={editData}
          onSuccess={() => {
            setIsOpen(false);
            setEditData(null);
            setIsFormLoading(false);
          }}
        />
      </UiMarksDialog>
    </>
  );
}
