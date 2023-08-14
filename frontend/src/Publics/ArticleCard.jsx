import React from 'react';
import { useParams } from 'react-router-dom';

const ArticleCard = () => {
  const { id } = useParams();
  return (
    <div>ArticleCard</div>
  )
}

export default ArticleCard;