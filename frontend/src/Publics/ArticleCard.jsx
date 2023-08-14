import React from 'react';
import { useParams } from 'react-router-dom';
import styles from "./ArticleCard.module.css";
import AllProjectsButton from '../UI/ButtonsProjects/AllProjectsButton';
import ArticleCardSlider from '../UI/ArticleCardSlider.jsx/ArticleCardSlider';
import { useSelector } from 'react-redux';

const ArticleCard = () => {
  const { id } = useParams();
  const slidesCard = useSelector((state) => state.article.article);
  const article = slidesCard.find((item) => item.id === parseInt(`${id}`));
  return (
    <div className={styles.main_project_card}>
    {article && <ArticleCardSlider slidesCard={[article]} />}
    <div className={styles.all_button_div}>
      <AllProjectsButton />
    </div>
    </div>
  )
}

export default ArticleCard;