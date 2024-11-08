import { useRef, useState } from 'react';
import InputMask from 'react-input-mask-next';

import styles from './FooterForm.module.scss';

import FooterInfo from './FooterInfo';
import mark from '../icons/footer-form-1.svg';

const ERROR_TEXT = {
  empty: 'Поле обязательно для заполнения',
  tel: 'Некорректный номер телефона',
};

const FooterForm = ({ handleMouseEnterFooterMore, handleMouseLeaveFooter }) => {
  const formRef = useRef(null);
  const [, setIsSent] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('Расскажите о Вашем проекте или идее');
  const [telError, setTelError] = useState('');

  const setError = (element, errorMessage) => {
    element.classList.add(styles.FooterForm__input_error);
    const errorElement = element.querySelector(`.${styles.FooterForm__textError}`);
    if (errorElement) errorElement.textContent = errorMessage;
  };

  const clearError = (element) => {
    element.classList.remove(styles.FooterForm__input_error);
    const errorElement = element.querySelector(`.${styles.FooterForm__textError}`);
    if (errorElement) errorElement.textContent = '';
  };


  const validateInput = (e) => {
    const { name, value, parentNode: parent } = e.currentTarget;

    if (name === 'tel') {
      if (!value.trim()) {
        setTelError(ERROR_TEXT.empty);
        setError(parent, ERROR_TEXT.empty);
      } else if (value.includes('_')) {
        setTelError(ERROR_TEXT.tel);
        setError(parent, ERROR_TEXT.tel);
      } else {
        setTelError('');
        clearError(parent);
      }
    } else {
      clearError(parent);
    }
  };

  const handleFocus = (e) => {
    const { parentNode: parent } = e.currentTarget;
    clearError(parent); 
    if (e.currentTarget.name === 'text' && !e.currentTarget.value.trim()) {
      setPlaceholderText('Запрос');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.currentTarget;
    if (name === 'text' && !value.trim()) {
      setPlaceholderText('Расскажите о Вашем проекте или идее');
    }
    validateInput(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const telInput = formRef.current.elements.tel;
    validateInput({ currentTarget: telInput });

    if (!telError) {
      setIsSent(true);
      formRef.current.submit();
    }
  };

  return (
    <section className={styles.FooterForm}>
      <div className={styles.FooterForm__container}>
        <div className={styles.FooterForm__top}>
          <div className={styles.FooterForm__left}>
            <img src={mark} alt="" />
          </div>
          <div className={styles.FooterForm__right}>
            <div className={styles.FooterForm__subtitle}>Опишите ваш запрос!</div>
            <form ref={formRef} className={styles.FooterForm__form} onSubmit={handleSubmit}>
              <div
                className={`${styles.FooterForm__input} ${styles.FooterForm__input_text}`}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                <textarea
                  maxLength={500}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  name="text"
                  id="text"
                  placeholder=" "></textarea>
                <span className={styles.FooterForm__placeholder}>{placeholderText}</span>
                <label htmlFor="text" className={styles.FooterForm__border}></label>
              </div>
              <div
                className={`${styles.FooterForm__input} ${styles.FooterForm__input_name}`}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                <input name="name" type="text" id="name" placeholder=" " onFocus={handleFocus} onBlur={validateInput} />
                <span className={styles.FooterForm__placeholder}>Ваше имя</span>
              </div>
              <div
                className={`${styles.FooterForm__input} ${styles.FooterForm__input_tel}`}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                <InputMask
                  mask="+7 (999) 999-99-99"
                  onBlur={(e) => validateInput(e)}
                  name="tel"
                  placeholder=" "
                  onFocus={handleFocus}
                />
                <span className={styles.FooterForm__placeholder}>Телефон</span>
                <span className={styles.FooterForm__textError}>{telError}</span>
              </div>
              <div className={styles.FooterForm__conclusion}>
                <div
                  className={styles.FooterForm__agreement}
                  onMouseEnter={handleMouseEnterFooterMore}
                  onMouseLeave={handleMouseLeaveFooter}>
                  Нажав на кнопку, соглашаюсь на <a href="./Information">обработку персональных данных</a>
                </div>
                <button
                  type="submit"
                  className={styles.FooterForm__submit}
                  onMouseEnter={handleMouseEnterFooterMore}
                  onMouseLeave={handleMouseLeaveFooter}>
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.FooterForm__bottom}>
          <FooterInfo
            handleMouseEnterFooterMore={handleMouseEnterFooterMore}
            handleMouseLeaveFooter={handleMouseLeaveFooter}
          />
        </div>
      </div>
    </section>
  );
};

export default FooterForm;
