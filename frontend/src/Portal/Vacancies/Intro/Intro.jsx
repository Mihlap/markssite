import React from 'react';
import RocketComponent from "../../../UI/Rocket/RocketComponents";
import styles from "./Intro.module.scss";

const Intro = () => {
	return (
		<>
			<section className={styles.Intro}>
				<div className={styles.Intro__wrapper}>
					<div className={styles.Intro__text}>
						<span className={styles.Intro__pretitle}> Мы ищем специалистов в&nbsp;наш дружный коллектив</span>
						<h1 className={styles.Intro__title}>Мы всегда в поиске талантливых специалистов</h1>
					</div>
					<div className={styles.Intro__animation}>
						<RocketComponent />
					</div>
				</div>
			</section>
		</>
	);
};

export default Intro;