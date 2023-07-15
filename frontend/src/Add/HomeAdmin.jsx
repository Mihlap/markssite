import React from 'react'
import styles from "./HomeAdmin.module.scss";

export default function HomeAdmin() {
  return (
    <section className={styles.home_admin_section}>
      <div className={styles.home_admin_section__title}>Публикации</div>

      <div>
        <div>
          <input style={{ background: "orange" }} type="number" name="" id="" />
          <button>добавить на главную</button>
        </div>
        <div>
          <div>
            <input
              style={{ background: "tomato" }}
              type="number"
              name=""
              id=""
            />
            <button>добавить на главную</button>
          </div>
        </div>
      </div>
      
      <div className={styles.home_admin_section__title}>Проекты</div>
      <div>
        <div>
          <input style={{ background: "orange" }} type="number" name="" id="" />
          <button>добавить на главную</button>
        </div>
        <div>
          <div>
            <input
              style={{ background: "tomato" }}
              type="number"
              name=""
              id=""
            />
            <button>добавить на главную</button>
          </div>
        </div>
      </div>
    </section>
  );
}
