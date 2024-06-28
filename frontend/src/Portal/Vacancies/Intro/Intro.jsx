import React, { useRef }  from 'react';
import styles from "./Intro.module.scss";

import StarsFour3d from '../StarsFour3d/StarsFour3d';
import ButtonLink from '../ButtonLink/ButtonLink';

const Intro = () => {
	const star1Ref = useRef(null);
	const star2Ref = useRef(null);
	const star3Ref = useRef(null);
	const star4Ref = useRef(null);

	return (
		<>
			<section className={styles.Intro}>
				<div className={styles.Intro__wrapper}>
					<div className={styles.Intro__text}>
						<span className={styles.Intro__pretitle}> Хочешь в&nbsp;нашу команду?</span>
						<h1 className={styles.Intro__title}>Мы всегда в&nbsp;поиске талантливых специалистов</h1>
						<ButtonLink text="Смотреть вакансии" currentHref="#" section="Intro" currentStyles={styles}/>
					</div>
					<div className={styles.Intro__animation}>
						{/* Добавление объектов звездочек с присваиванием класса родителького компонента */}
						<StarsFour3d 
							section='Intro' 
							styles={styles} 
							star1Ref={star1Ref} 
							star2Ref={star2Ref} 
							star3Ref={star3Ref} 
							star4Ref={star4Ref} 
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Intro;