import React from 'react';
import styles from "./BenefitsGrid.module.scss";


import benefit_1 from "../icons/benefit-1.svg";

const benefitsArray = [
	{
		icon: "../icons/benefit-1.svg",
		title: "Мы за развитие команды",
		desc: "Регулярные обучение, Ревит, индивидуальные программы, управление",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Свобода выбора и мышления",
		desc: "Ценим идеи наших сотрудников, поощряем инициативность",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Заботимся о здоровье",
		desc: "ДМС, корпоративный спорт: футбол, баскетбол, пинг-понг, волейбол, йога",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Или тут про язвки?",
		desc: "Корпоративная скидка на Skyeng, внутреннее обучение английскому",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Международное проектирование",
		desc: "Создаем уникальные объекты по России и миру",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Весело отрывемся",
		desc: "Корпоративные мероприятия, ежегодный сплав",
	},
]

const BenefitsGrid = () => {
	return (
		<section className={styles.BenefitsGrid}>
			<h2 className={styles.BenefitsGrid__title}>Преимущества работы с нами
			</h2>
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