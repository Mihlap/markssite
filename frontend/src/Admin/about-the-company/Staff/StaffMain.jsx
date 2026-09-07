import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteStaffAsync, toggleVisibilityStaffAsync, reorderStaffAsync } from '../../../store/Slice/StaffSliceNew';
import s from './Styles.module.css';
import { UiMarksButton, UiMarksDialog, UiMarksDeleteModal } from '../../ui';
import StaffForm from './StaffForm';
import { useAdminUser } from '../../hooks/useAdminUser';
import List from './List';
import { isStaffVisibleInCategory } from '../../../Company/utils/staffVisibility';
import { reorderFullName } from '../../../Company/utils/reorderFullName';

export default function StaffMain({ items, user, currentCategory, loading, error, onStaffChanged }) {
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
  const [orderedItems, setOrderedItems] = useState(items || []);

  useEffect(() => {
    setOrderedItems(items || []);
  }, [items]);

  const handleEdit = useCallback((el) => {
    setEditData(el);
    setIsOpen(true);
  }, []);

  const handleToggle = useCallback(
    (el) => {
      if (!currentCategory) return;
      const visibleNow = isStaffVisibleInCategory(el, currentCategory);
      dispatch(
        toggleVisibilityStaffAsync({
          id: el.id,
          isVisible: !visibleNow,
          category: currentCategory,
        }),
      ).finally(() => onStaffChanged?.());
    },
    [currentCategory, dispatch, onStaffChanged],
  );

  const handleDelete = useCallback(
    (el) => {
      setDeleteTarget({
        id: el.id,
        name: el.name,
        category: currentCategory,
        inMultipleCategories: (el.category || []).length > 1,
      });
    },
    [currentCategory],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    dispatch(deleteStaffAsync({ id: deleteTarget.id, category: deleteTarget.category })).finally(() =>
      onStaffChanged?.(),
    );
    setDeleteTarget(null);
  }, [dispatch, deleteTarget, onStaffChanged]);

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
        <UiMarksButton color="blue" size="large" icon onClick={() => setIsOpen(true)}>
          Добавить сотрудника
        </UiMarksButton>
      )}
      {loading ? (
        <p className={s.loading}>загрузка. . . </p>
      ) : error ? (
        <p className={s.error}>Ошибка загрузки данных.</p>
      ) : orderedItems.length === 0 ? (
        <p className={s.empty}>В этом отделе пока нет сотрудников.</p>
      ) : (
        <List
          items={orderedItems}
          category={currentCategory}
          canDrag={canDrag}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onReorder={(next) =>
            dispatch(reorderStaffAsync(next.map((it, i) => ({ id: it.id, sortIndex: i })))).finally(() =>
              onStaffChanged?.(),
            )
          }
        />
      )}

      <UiMarksDeleteModal
        isOpen={!!deleteTarget}
        title={
          <>
            Вы точно хотите удалить <br /> сотрудника «{reorderFullName(deleteTarget?.name)}»?
          </>
        }
        description={
          deleteTarget?.inMultipleCategories ? (
            <>
              Сотрудник будет удален только из категории <br />
              «{deleteTarget?.category}». В других категориях он останется
            </>
          ) : (
            <>
              Если вы удалите информацию о сотруднике, вернуть <br />
              ее будет невозможно
            </>
          )
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      <UiMarksDialog
        isOpen={isOpen}
        onClose={handleDialogClose}
        title={editData ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
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
            onStaffChanged?.();
          }}
        />
      </UiMarksDialog>
    </>
  );
}
