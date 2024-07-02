import React from 'react';

import star_1 from '../icons/star-1.png';
import star_2 from '../icons/star-2.png';
import star_3 from '../icons/star-3.png';
import star_4 from '../icons/star-4.png';

// Описание компонента - объекты звездочек с классом нужного компонента для управления стилями из родительского компонента
const StarsFour3d = ({section, styles, star1Ref, star2Ref, star3Ref, star4Ref}) => {
  return (
    <>
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_1`]}`}
        style={{ backgroundImage: `url(${star_1})` }}
        ref={star1Ref}
      />
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_2`]}`}
        style={{ backgroundImage: `url(${star_2})` }}
        ref={star2Ref}
      />
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_3`]}`}
        style={{ backgroundImage: `url(${star_3})` }}
        ref={star3Ref}
      />
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_4`]}`}
        style={{ backgroundImage: `url(${star_4})` }}
        ref={star4Ref}
      />
    </>
  );
};


export default StarsFour3d;