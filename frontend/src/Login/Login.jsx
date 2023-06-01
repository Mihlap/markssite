import React from 'react'
import styles from "./Login.module.scss"

export default function Login() {
  return (
    <section className={styles.login_container}>
      <div className={styles.login_block}>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="input"
            className={styles.form__field}
            placeholder="Name"
            name="name"
            id="name"
            required
          />
          <label for="name" className={styles.form__label}>
            Name
          </label>
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="password"
            className={styles.form__field}
            placeholder="password"
            name="password"
            id="name"
            required
          />
          <label for="name" className={styles.form__label}>
            password
          </label>
        </div>
      </div>
    </section>
  );
}
