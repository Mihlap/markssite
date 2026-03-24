import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToggleStateForButton2Async } from '../../store/Slice/toggleSlice';
import { UiMarksSegmentedControls, UiMarksHeading, UiMarksSwitch } from '../ui';
import AddNews from './AddNews/AddNews';
import AddJournal from './AddJournal/AddJournal';
import { Icon1, Icon2 } from './icon';

import s from './Styles.module.css';

export default function AddArticles({ user }) {
  const dispatch = useDispatch();
  const isActiveForButton2 = useSelector((state) => state.toggle.isActiveForButton2);
  const [selectedFilter, setSelectedFilter] = useState('Новости');

  const controlRef = useRef();
  const newsRef = useRef();
  const journalRef = useRef();

  const segments = [
    { value: 'Новости', label: 'Новости', ref: newsRef, icon: <Icon1 /> },
    { value: 'Marks Journal', label: 'Marks Journal', ref: journalRef, icon: <Icon2 /> },
  ];

  const handleFilterChange = useCallback((value) => {
    setSelectedFilter(value);
  }, []);

  const toggleActive = useCallback(() => {
    dispatch(updateToggleStateForButton2Async(!isActiveForButton2));
  }, [dispatch, isActiveForButton2]);

  return (
    <>
      <div className={s.wrapHeading}>
        <UiMarksHeading size="3xl">Публикации</UiMarksHeading>
        <div className={s.wrapHide}>
          <p className={s.name}>Скрыть фильтрацию</p>
          <UiMarksSwitch isActive={isActiveForButton2} onClick={toggleActive} />
        </div>
      </div>
      <UiMarksSegmentedControls
        name="articles-filter"
        segments={segments}
        callback={handleFilterChange}
        controlRef={controlRef}
        customStyles={{paddingBottom: '24px'}}
      />
      {selectedFilter === 'Новости' ? <AddNews user={user} /> : <AddJournal user={user} />}
    </>
  );
}
