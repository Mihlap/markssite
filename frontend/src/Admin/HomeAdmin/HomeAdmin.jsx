import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { arrIdProjectSelector } from './utils/HomeAdminSelectors';
import { arrIdArticlesLeftSelector } from './utils/ArticleLeftSelectors';
import { arrIdArticlesRightSelector } from './utils/ArticleRightSelectors';
import SearchPublicProject from './SearchPublicProject';
import SearchPublicLeft from './SearchPublicLeft';
import SearchPublicRight from './SearchPublicRight';
import { getZaprosData } from '../../store/Slice/searchProjectMainSlice';
import { searchArticleLeftGet } from '../../store/Slice/searchArticlePublicLeftSlice';
import { searchArticleRightGet } from '../../store/Slice/searchArticlePublicRightSlice';

import { UiMarksHeading } from '../ui';

export default function HomeAdmin() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const articles = useSelector((state) => state.article.article);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState('');
  const [showOk, setShowOk] = useState(false);
  const [replacementMessage, setReplacementMessage] = useState('');
  const [replacement, setReplacement] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [savedId, setSavedId] = useState(null);

  const [searcIdOne, setSearcIdOne] = useState('');
  const [saveIdOne, setSaveIdOne] = useState(null);
  const [isBtnDisabledPublicOne, setIsBtnDisabledPublicOne] = useState(true);

  const [searcIdTwo, setSearcIdTwo] = useState('');
  const [saveIdTwo, setSaveIdTwo] = useState(null);
  const [isBtnDisabledPublicTwo, setIsBtnDisabledPublicTwo] = useState(true);

  const arrIdProject = useSelector(arrIdProjectSelector);
  const arrIdArticleLeft = useSelector(arrIdArticlesLeftSelector);
  const arrIdArticleRight = useSelector(arrIdArticlesRightSelector);

  useEffect(() => {
    dispatch(getZaprosData());
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
            showError={showError}
            errorMessage={errorMessage}
            showOk={showOk}
            okMessage={okMessage}
            setErrorMessage={setErrorMessage}
            setShowError={setShowError}
            setOkMessage={setOkMessage}
            setShowOk={setShowOk}
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
        <SearchPublicProject
          projects={projects}
          arrIdProject={arrIdProject}
          setSearchId={setSearchId}
          setIsButtonDisabled={setIsButtonDisabled}
          setSavedId={setSavedId}
          searchId={searchId}
          setOkMessage={setOkMessage}
          setShowOk={setShowOk}
          setErrorMessage={setErrorMessage}
          setShowError={setShowError}
          setReplacement={setReplacement}
          setReplacementMessage={setReplacementMessage}
          savedId={savedId}
          isButtonDisabled={isButtonDisabled}
          showError={showError}
          errorMessage={errorMessage}
          showOk={showOk}
          okMessage={okMessage}
          replacement={replacement}
          replacementMessage={replacementMessage}
        />
      </div>
    </section>
  );
}
