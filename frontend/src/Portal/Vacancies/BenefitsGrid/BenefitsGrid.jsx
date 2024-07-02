import React, { useLayoutEffect, useRef }  from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import StarsFour3d from '../StarsFour3d/StarsFour3d';

import styles from './BenefitsGrid.module.scss';

import benefit_1 from '../icons/benefit-1.svg';
import benefit_2 from '../icons/benefit-2.svg';
import benefit_3 from '../icons/benefit-3.svg';
import benefit_4 from '../icons/benefit-4.svg';
import benefit_5 from '../icons/benefit-5.svg';
import benefit_6 from '../icons/benefit-6.svg';


const benefitsArray = [
	{
		icon: benefit_1,
		title: "Мы за развитие команды",
		desc: "Регулярные внутренние и внешние обучения, корпоративная скидка на Skyeng, внутреннее обучение английскому языку",
	},
	{
		icon: benefit_2,
		title: "Свобода выбора и мышления",
		desc: "Ценим идеи наших сотрудников, поощряем инициативность",
	},
	{
		icon: benefit_3,
		title: "Международное проектирование",
		desc: "Создаем уникальные объекты по всей России и миру",
	},
	{
		icon: benefit_4,
		title: "Заботимся о здоровье",
		desc: "Расширенный ДМС, страхование жизни",
	},
	{
		icon: benefit_5,
		title: "Корпоративный спорт",
		desc: "Футбол, баскетбол, настольный теннис, волейбол, йога, шахматы, велоспорт, бег, Гонки героев",
	},
	{
		icon: benefit_6,
		title: "Весело отрывемся",
		desc: "Корпоративные мероприятия, ежегодный сплав",
	},
]


const BenefitsGrid = () => {
	const star1Ref = useRef(null);
	const star2Ref = useRef(null);
	const star3Ref = useRef(null);
	const star4Ref = useRef(null);


	// Анимация звёзд
	const rotationDeg = 60;
	const opacity = 0.4;

	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.BenefitsGrid}`,
				start: 'top bottom',
				end:'bottom top',
				scrub: true,
			},
		});

		tl.to([star1Ref.current, star3Ref.current],
			 {
				rotation: rotationDeg,
			}
		)

		const tl2 = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.BenefitsGrid}`,
				start: 'top bottom',
				end:'bottom top',
				scrub: true,
			},
		});

		tl2.to([star2Ref.current, star4Ref.current],
			{
			 rotation: -(rotationDeg),
		 }
	 )

	 const tl3 = gsap.timeline({
		scrollTrigger: {
			trigger: `.${styles.BenefitsGrid}`,
			start: 'top bottom',
			end:'bottom top',
			scrub: true,
		},
	});
	
	tl3.to([star3Ref.current, star4Ref.current],
		{
			opacity: opacity
		}
	)
	}, []);

	return (
		<section className={styles.BenefitsGrid}>
			<h2 className={styles.BenefitsGrid__title}>Преимущества работы с нами
			</h2>
				<StarsFour3d 
					section='BenefitsGrid' 
					styles={styles} 
					star1Ref={star1Ref} 
					star2Ref={star2Ref} 
					star3Ref={star3Ref} 
					star4Ref={star4Ref} 
				/>
				<ul className={styles.BenefitsGrid__items}>
					{benefitsArray.map((item, index) => {
						return (
							<li className={styles.BenefitsGrid__item} key={index}>
								<div className={styles.BenefitsGrid__icon}>
										<img src={item.icon}/>
								</div>
								<div className={styles.BenefitsGrid__text}>
									<h3>{item.title}</h3>
									<span>{item.desc}</span>
								</div>
							</li>
						)})
				}
			</ul>

		</section>
	);
};

export default BenefitsGrid;