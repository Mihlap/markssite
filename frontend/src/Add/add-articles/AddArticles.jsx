import { useCallback, useRef, useState } from 'react';
import styles from '../style/style-card.module.scss';
import { UiMarksSegmentedControls, UiMarksHeading } from '../ui';
import AddNews from './AddNews/AddNews';
import AddJournal from './AddJournal/AddJournal';
import { Icon1, Icon2 } from './icon';

export default function AddArticles({ user }) {
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

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <UiMarksHeading size="3xl">Публикации</UiMarksHeading>
        </div>
        <UiMarksSegmentedControls
          name="articles-filter"
          segments={segments}
          callback={handleFilterChange}
          controlRef={controlRef}
        />
        <>{selectedFilter === 'Новости' ? <AddNews user={user} /> : <AddJournal user={user} />}</>
      </div>
    </section>
  );
}
