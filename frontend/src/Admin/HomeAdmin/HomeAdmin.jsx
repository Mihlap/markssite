import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { arrIdArticlesLeftSelector } from './utils/ArticleLeftSelectors';
import { arrIdArticlesRightSelector } from './utils/ArticleRightSelectors';
import SearchPublicProject from './SearchPublicProject';
import SearchPublicLeft from './SearchPublicLeft';
import SearchPublicRight from './SearchPublicRight';
import { searchArticleLeftGet } from '../../store/Slice/searchArticlePublicLeftSlice';
import { searchArticleRightGet } from '../../store/Slice/searchArticlePublicRightSlice';
import { UiMarksHeading } from '../ui';

export default function HomeAdmin() {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article.article);

  const [searcIdOne, setSearcIdOne] = useState('');
  const [saveIdOne, setSaveIdOne] = useState(null);
  const [isBtnDisabledPublicOne, setIsBtnDisabledPublicOne] = useState(true);

  const [searcIdTwo, setSearcIdTwo] = useState('');
  const [saveIdTwo, setSaveIdTwo] = useState(null);
  const [isBtnDisabledPublicTwo, setIsBtnDisabledPublicTwo] = useState(true);

  const arrIdArticleLeft = useSelector(arrIdArticlesLeftSelector);
  const arrIdArticleRight = useSelector(arrIdArticlesRightSelector);

  useEffect(() => {
    dispatch(searchArticleLeftGet());
    dispatch(searchArticleRightGet());
  }, [dispatch]);

  return (
    <section>
      <div>
        <UiMarksHeading size="3xl" pb="xl">
          Публикации
        </UiMarksHeading>
        <div style={{ display: 'flex', gap: '32px' }}>
          <SearchPublicLeft
            articles={articles}
            arrIdArticleLeft={arrIdArticleLeft}
            setSearcIdOne={setSearcIdOne}
            setIsBtnDisabledPublicOne={setIsBtnDisabledPublicOne}
            saveIdOne={saveIdOne}
            setSaveIdOne={setSaveIdOne}
            searcIdOne={searcIdOne}
            isBtnDisabledPublicOne={isBtnDisabledPublicOne}
          />
          <SearchPublicRight
            articles={articles}
            arrIdArticleRight={arrIdArticleRight}
            saveIdTwo={saveIdTwo}
            setSaveIdTwo={setSaveIdTwo}
            searcIdTwo={searcIdTwo}
            setSearcIdTwo={setSearcIdTwo}
            setIsBtnDisabledPublicTwo={setIsBtnDisabledPublicTwo}
            isBtnDisabledPublicTwo={isBtnDisabledPublicTwo}
          />
        </div>
      </div>
      <div style={{ paddingTop: '147px' }}>
        <UiMarksHeading size="3xl" pb="xl">
          Проекты
        </UiMarksHeading>
        <SearchPublicProject />
      </div>
    </section>
  );
}
