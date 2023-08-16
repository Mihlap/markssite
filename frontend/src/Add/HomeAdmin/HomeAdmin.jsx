import React, {useState } from "react";
import styles from "./HomeAdmin.module.scss";

import { useSelector } from "react-redux";
import { arrIdProjectSelector } from "./utils/HomeAdminSelectors";
import { arrIdArticlesLeftSelector } from "./utils/ArticleLeftSelectors";
import { arrIdArticlesRightSelector } from "./utils/ArticleRightSelectors";
import SearchPublicProject from "./SearchPublicProject";
import SearchPublicLeft from "./SearchPublicLeft";
import SearchPublicRight from "./SearchPublicRight";

export default function HomeAdmin({ projects, articles }) {
  // стейты для инпута ПРОЕТЫ
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState("");
  const [showOk, setShowOk] = useState(false);
  const [replacementMessage, setReplacementMessage] = useState("");
  const [replacement, setReplacement] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [savedId, setSavedId] = useState(null);
  // стейты для инпута ПРОЕТЫ

  // стейты для инпута ПУБЛИКАЦИИ левый
  const [searcIdOne, setSearcIdOne] = useState("");
  const [saveIdOne, setSaveIdOne] = useState(null);
  const [isBtnDisabledPublicOne, setIsBtnDisabledPublicOne] = useState(true);
  // стейты для инпута ПУБЛИКАЦИИ левый

  // стейты для инпута ПУБЛИКАЦИИ справа
  const [searcIdTwo, setSearcIdTwo] = useState("");
  const [saveIdTwo, setSaveIdTwo] = useState(null);
  const [isBtnDisabledPublicTwo, setIsBtnDisabledPublicTwo] = useState(true);
  // стейты для инпута ПУБЛИКАЦИИ справа

  const arrIdProject = useSelector(arrIdProjectSelector);
  const arrIdArticleLeft = useSelector(arrIdArticlesLeftSelector);
  const arrIdArticleRight = useSelector(arrIdArticlesRightSelector);


  return (
    <section className={styles.home_admin_section}>
      <div className={styles.home_admin_section__title}>Публикации</div>
      <div className={styles.home_admin_section__article_container}>
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

      <div className={styles.home_admin_section__title}>Проекты</div>

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
    </section>
  );
}
