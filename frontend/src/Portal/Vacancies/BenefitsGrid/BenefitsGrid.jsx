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
		title: "Мы за развитие команды",
		desc: "Регулярные обучение, Ревит, индивидуальные программы, управление",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Мы за развитие команды",
		desc: "Регулярные обучение, Ревит, индивидуальные программы, управление",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Мы за развитие команды",
		desc: "Регулярные обучение, Ревит, индивидуальные программы, управление",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Мы за развитие команды",
		desc: "Регулярные обучение, Ревит, индивидуальные программы, управление",
	},
	{
		icon: "../icons/benefit-1.svg",
		title: "Мы за развитие команды",
		desc: "Регулярные обучение, Ревит, индивидуальные программы, управление",
	},
]

const BenefitsGrid = () => {
	return (
		<section className={styles.BenefitsGrid}>
			<h2 className={styles.BenefitsGrid__title}>Преимущества работы с нами
			</h2>
			<div className={styles.BenefitsGrid__items}>
				{benefitsArray.map((item, index) => {
					return (
						<div className={styles.BenefitsGrid__item} key={index}>
							<div className={styles.BenefitsGrid__icon}>
									<img src={benefit_1}/>
							</div>
							<h3>{item.title}</h3>
							<span>{item.desc}</span>
						</div>
					)})
				}
			</div>

		</section>
	);
};

export default BenefitsGrid;