import React, { useEffect, useState } from "react";
import styles from "./Vacancies.module.css";
import { Link } from "react-router-dom";
import LoadingCircle from "../../Loading/LoadingCircle";

const Vacancies = ({ handleMouseEnter, handleMouseLeave }) => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch(
          "https://api.hh.ru/vacancies?employer_id=1098613"
        );
        if (response.ok) {
          const data = await response.json();
          setVacancies(data.items);
          setLoading(false);
        } else {
          console.error("Failed to fetch vacancies");
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      }
    };

    fetchVacancies();
  }, []);

  return (
    <div className={styles.main_vacancies_block}>
      <div className={styles.wrapper_vacancies}>
        <div className={styles.rocket_image}>
          <img src="/assets/rocket.png" alt="rocket.png" />
        </div>
        <div className={styles.vacancies_header_wrapper}>
          <span className={styles.vacancies_header1}>
            Мы ищем специалистов в&nbsp;наш дружный коллектив
          </span>
          <span className={styles.vacancies_header2}>Вакансии</span>
        </div>
      </div>
      <div className={styles.vacancies_advertisingBlock}>
        <div className={styles.vacancies_advertisingBlock_text1}>
          Не отображаются вакансии?
        </div>
        <div className={styles.vacancies_advertisingBlock_text2}>
          Возможно у вас включен блокировщик рекламы
        </div>
      </div>
      {loading ? ( 
        <div className={styles.loader}>
          <LoadingCircle/>
        </div>
      ) : (
        <section className={styles.vacancies_section}>
          <div className={styles.vacancies_list_container}>
            <div className={styles.vacancies_list}>
              {vacancies.map((vacancy) => (
                <div className={styles.vacancia_name} key={vacancy.id}>
                  {vacancy.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <div className={styles.vacancies_text_for_email}>
        Вы можете отправить резюме на&nbsp;почту:
        <Link
          className={styles.mail_link}
          to="mailto:ok@marksgroup.ru"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className={styles.span_mail_vacancies}>ok@marksgroup.ru</span>
        </Link>
      </div>
    </div>
  );
};

export default Vacancies;


{/* <script class="hh-script" src="https://api.hh.ru/widgets/vacancies/employer?employer_id=1098613&locale=RU&links_color=1560b2&border_color=1560b2"></script> */}
