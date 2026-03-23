import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffAsync, deleteStaffAsync, toggleVisibilityStaffAsync } from '../../../store/Slice/StaffSliceNew';
import { UiMarksButton, UiMarksDialog, UiMarksDeleteModal } from '../../ui';
import StaffForm from './StaffForm';
import { useAdminUser } from '../../hooks/useAdminUser';
import StaffList from './StaffList';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function StaffMain({ items, user }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  const { canDelete, canAdd, canEdit, canDrag } = useAdminUser(user);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleEdit = useCallback((el) => {
    setEditData(el);
    setIsOpen(true);
  }, []);

  const handleToggle = useCallback((el) => {
    dispatch(toggleVisibilityStaffAsync({ id: el.id, isVisible: !el.isVisible }));
  }, [dispatch]);

  const handleDelete = useCallback((el) => {
    setDeleteTarget({ id: el.id, name: el.name });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    dispatch(deleteStaffAsync({ id: deleteTarget.id }));
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  useEffect(() => {
    dispatch(fetchStaffAsync());
  }, [dispatch]);

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

  return (
    <>
      {canAdd && (
        <UiMarksButton defaultStyle="blue" size="large" icon onClick={() => setIsOpen(true)}>
          Добавить сотрудника
        </UiMarksButton>
      )}

      <StaffList
        items={items}
        canDelete={canDelete}
        canEdit={canEdit}
        canDrag={canDrag}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
      
      <UiMarksDeleteModal
        isOpen={!!deleteTarget}
        title={<>Вы точно хотите удалить <strong>«{deleteTarget?.name}»</strong>?</>}
        description="Удалённого сотрудника вернуть будет невозможно"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      <UiMarksDialog
        isOpen={isOpen}
        onClose={handleDialogClose}
        title={editData ? 'Редактирование сотрудника' : 'Добавить сотрудника'}
        isSaveDisabled={!isFormValid}
        onSave={() => document.getElementById('add-form-staff')?.requestSubmit()}
        isLoading={isFormLoading}
        isExit={showExitWarning}
        onExitConfirm={handleForceClose}
        onExitCancel={() => setShowExitWarning(false)}
        nameSpinner="Сотрудник">
        <StaffForm
          ref={formRef}
          onValidityChange={setIsFormValid}
          onLoadingChange={setIsFormLoading}
          onDirtyChange={handleDirtyChange}
          editStaffData={editData}
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
