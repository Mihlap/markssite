import React, { useRef }  from 'react';
import styles from "./Intro.module.scss";

import ButtonLink from '../ButtonLink/ButtonLink';
import starsDesktop from '../icons/intro-stars.png';

const Intro = () => {
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
						<img src={starsDesktop}></img>
					</div>
				</div>
			</section>
		</>
	);
};

export default Intro;