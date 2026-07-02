import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffAsync } from '../../store/Slice/StaffSliceNew';
import { fetchStaffCategoryTogglesAsync, updateStaffCategoryToggleAsync } from '../../store/Slice/toggleSlice';
import { UiMarksHeading, UiMarksSegmentedControls, UiMarksSwitch } from '../ui';

import HistoryMain from './CompanyHistory/HistoryMain';
import { useAdminUser } from '../hooks/useAdminUser';
import StaffMain from './Staff/StaffMain';

const CAT_KEYS = {
  Руководство: 'leadership',
  'Научно-техническое сопровождение': 'science',
  HR: 'hr',
};

export default function Company({ user }) {
  const dispatch = useDispatch();
  const { adminItems, adminLoading, error } = useSelector((s) => s.staff);
  const { canDrag } = useAdminUser(user);
  const staffCats = useSelector((s) => s.toggle.staffCats);
  const [currentCategory, setCurrentCategory] = useState('Руководство');

  const controlRef = useRef();
  const staffRef = useRef();
  const scienceRef = useRef();
  const hrlRef = useRef();

  const segments = [
    {
      value: 'Руководство',
      label: 'Руководство',
      ref: staffRef,
      disabled: !staffCats.leadership,
      icon: canDrag ? (
        <UiMarksSwitch
          isActive={!!staffCats.leadership}
          onClick={(e) => {
            e.stopPropagation();
            toggleCategory('Руководство');
          }}
        />
      ) : null,
    },
    {
      value: 'Научно-техническое сопровождение',
      label: 'Научно-техническое сопровождение',
      ref: scienceRef,
      disabled: !staffCats.science,
      icon: canDrag ? (
        <UiMarksSwitch
          isActive={!!staffCats.science}
          onClick={(e) => {
            e.stopPropagation();
            toggleCategory('Научно-техническое сопровождение');
          }}
        />
      ) : null,
    },
    {
      value: 'HR',
      label: 'HR',
      ref: hrlRef,
      disabled: !staffCats.hr,
      icon: canDrag ? (
        <UiMarksSwitch
          isActive={!!staffCats.hr}
          onClick={(e) => {
            e.stopPropagation();
            toggleCategory('HR');
          }}
        />
      ) : null,
    },
  ];

  useEffect(() => {
    dispatch(fetchStaffCategoryTogglesAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStaffAsync({ category: currentCategory }));
  }, [dispatch, currentCategory]);

  const refetchStaff = useCallback(() => {
    dispatch(fetchStaffAsync({ category: currentCategory }));
  }, [dispatch, currentCategory]);

  const toggleCategory = useCallback(
    (cat) => {
      const key = CAT_KEYS[cat];
      dispatch(updateStaffCategoryToggleAsync({ key, value: !staffCats[key] }));
    },
    [staffCats, dispatch]
  );

  return (
    <>
      <HistoryMain user={user} />
      <UiMarksHeading size="3xl" pt="64px">
        Сотрудники
      </UiMarksHeading>
      <UiMarksSegmentedControls
        name="staff-filter"
        mesh
        segments={segments}
        controlRef={controlRef}
        callback={(value) => setCurrentCategory(value)}
        customStyles={{ padding: '24px 0px' }}
      />
      <StaffMain
        items={adminItems}
        user={user}
        currentCategory={currentCategory}
        loading={adminLoading}
        error={error}
        onStaffChanged={refetchStaff}
      />
    </>
  );
}
