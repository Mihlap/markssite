import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchStaffAsync} from '../../store/Slice/StaffSliceNew';
import { fetchStaffCategoryTogglesAsync, updateStaffCategoryToggleAsync } from '../../store/Slice/toggleSlice';
import { UiMarksSegmentedControls, UiMarksSwitch, UiMarksHeading } from '../ui';

import AddCompanyHistory from './CompanyHistory/AddCompanyHistory';
import { useAdminUser } from '../hooks/useAdminUser';
import StaffMain from './Staff/StaffMain';

const CAT_KEYS = { Руководство: 'leadership', 'Научное сопровождение': 'science', HR: 'hr' };


export default function AddCompany({ user }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.staff);
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
      value: 'Научное сопровождение',
      label: 'Научное сопровождение',
      ref: scienceRef,
      disabled: !staffCats.science,
      icon: canDrag ? (
        <UiMarksSwitch
          isActive={!!staffCats.science}
          onClick={(e) => {
            e.stopPropagation();
            toggleCategory('Научное сопровождение');
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
    dispatch(fetchStaffAsync());
    dispatch(fetchStaffCategoryTogglesAsync());
  }, [dispatch]);


  const toggleCategory = useCallback(
    (cat) => {
      const key = CAT_KEYS[cat];
      dispatch(updateStaffCategoryToggleAsync({ key, value: !staffCats[key] }));
    },
    [staffCats, dispatch]
  );

  const filtered = (items || []).filter((el) => {
    const cats = el.category || [];
    if (currentCategory === 'Научное сопровождение') {
      return cats.some((c) => c === 'Научное сопровождение' || c === 'Научно-техническое сопровождение');
    }
    return cats.includes(currentCategory);
  });

  return (
    <section>
      <AddCompanyHistory user={user} />
      <UiMarksHeading size="3xl">
        Сотрудники
      </UiMarksHeading>

      <UiMarksSegmentedControls
        name="staff-filter"
        mesh
        segments={segments}
        controlRef={controlRef}
        callback={(value) => setCurrentCategory(value)}
        customStyles={{padding: '24px 0px'}}
      />

      <StaffMain items={filtered} user={user} />
    </section>
  );
}
