import { useRef, useState } from 'react';
import InputMask from 'react-input-mask-next';

import styles from './FooterForm.module.scss';

import FooterInfo from './FooterInfo';
import Popup from '../UI/Popup/Popup';
import mark from '../icons/footer-form-1.svg';

const ERROR_TEXT = {
  empty: 'Поле обязательно для заполнения',
  tel: 'Некорректный номер телефона',
};

const FooterForm = ({
  handleMouseEnterFooter,
  handleMouseEnterFooterMore,
  handleMouseLeaveFooter,
  handleMouseLeave,
}) => {
  const formRef = useRef(null);

  const [isSent, setIsSent] = useState(false);

  // Состояние для текста плейсхолдера в textarea
  const [placeholderText, setPlaceholderText] = useState('Расскажите о Вашем проекте или идее');

  // Функция для валидации ввода телефона
  const validateInput = (e) => {
    const { name, value, parentNode: parent } = e.currentTarget;

    // Функция для установки сообщения об ошибке
    const setError = (element, errorMessage) => {
      element.classList.add(styles.FooterForm__input_error);
      const errorElement = element.querySelector(`.${styles.FooterForm__textError}`);
      if (errorElement) errorElement.textContent = errorMessage;
    };

    // Функция для очистки сообщения об ошибке
    const clearError = (element) => {
      element.classList.remove(styles.FooterForm__input_error);
      const errorElement = element.querySelector(`.${styles.FooterForm__textError}`);
      if (errorElement) errorElement.textContent = '';
    };

    // Валидация
    if (name === 'tel') {
      if (!value.trim()) setError(parent, ERROR_TEXT.empty);
      else if (value.includes('_')) setError(parent, ERROR_TEXT.tel);
      else clearError(parent);
    } else {
      clearError(parent);
    }
  };

  // Обработка фокуса в textarea
  const handleFocus = (e) => {
    const { value } = e.currentTarget;
    if (!value.trim()) {
      setPlaceholderText('Запрос');
    }
  };

  // Обработка потери фокуса в textarea
  const handleBlur = (e) => {
    const { value } = e.currentTarget;
    if (!value.trim()) {
      setPlaceholderText('Расскажите о Вашем проекте или идее');
    } else {
      setPlaceholderText('Запрос');
    }
    validateInput(e);
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    validateInput({ currentTarget: formRef.current.elements.tel });

    // Если после валидации ошибок нет, отправляем форму
    if (!formRef.current.querySelector(`.${styles.FooterForm__input_error}`)) {
      setIsSent(true);
      formRef.current.submit();
    }
  };

  return (
    <section className={styles.FooterForm} onMouseEnter={handleMouseEnterFooter} onMouseLeave={handleMouseLeave}>
      <div className={styles.FooterForm__container}>
        <div className={styles.FooterForm__top}>
          <div className={styles.FooterForm__left}>
            <img src={mark} />
          </div>
          <div className={styles.FooterForm__right}>
            <div className={styles.FooterForm__subtitle}>Опишите ваш запрос!</div>
            <form ref={formRef} className={styles.FooterForm__form} onSubmit={handleSubmit}>
              <div className={`${styles.FooterForm__input} ${styles.FooterForm__input_text}`}>
                <textarea onFocus={handleFocus} onBlur={handleBlur} name="text" id="text" placeholder=" "></textarea>
                <span className={styles.FooterForm__placeholder}>{placeholderText}</span>
              </div>
              <div className={`${styles.FooterForm__input} ${styles.FooterForm__input_name}`}>
                <input name="name" type="text" id="name" placeholder=" " />
                <span className={styles.FooterForm__placeholder}>Ваше имя</span>
              </div>
              <div className={`${styles.FooterForm__input} ${styles.FooterForm__input_tel}`}>
                <InputMask mask="+7 (999) 999-99-99" onBlur={validateInput} name="tel" placeholder=" " />
                <span className={styles.FooterForm__placeholder}>Телефон</span>
                <span className={styles.FooterForm__textError}>Некорректный номер телефона</span>
              </div>
              <div className={styles.FooterForm__conclusion}>
                <div className={styles.FooterForm__agreement}>
                  Нажав на кнопку, соглашаюсь на <a href="./Information">обработку персональных данных</a>
                </div>
                <button type="submit" className={styles.FooterForm__submit}>
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.FooterForm__bottom}>
          <FooterInfo
            handleMouseEnterFooter={handleMouseEnterFooter}
            handleMouseEnterFooterMore={handleMouseEnterFooterMore}
            handleMouseLeaveFooter={handleMouseLeaveFooter}
            handleMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
      <Popup isSent={isSent} />
    </section>
  );
};

export default FooterForm;
