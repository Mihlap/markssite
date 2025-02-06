import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { InputMask } from '@react-input/mask';
import styles from './FooterForm.module.scss';
import FooterInfo from './FooterInfo';
import mark from '../icons/footer-form-1.svg';
import LoadingCircle from '../Loading/LoadingCircle';
import { openModal } from '../store/Slice/modalSlice';
import { useDispatch } from 'react-redux';

const Host = process.env.REACT_APP_SERVER_HOST;

const ERROR_TEXT = {
  empty: 'Поле обязательно для заполнения',
  tel: 'Некорректный номер телефона',
};

const PLACEHOLDER_TEXT = {
  default: 'Расскажите о Вашем проекте или идее',
  focus: 'Запрос',
};


const FooterForm = ({ handleMouseEnterFooterMore, handleMouseLeaveFooter }) => {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setIsSent] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(PLACEHOLDER_TEXT.default);
  const [telError, setTelError] = useState('');
  const [telTouched, setTelTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const setError = useCallback((element, errorMessage) => {
    element.classList.add(styles.FooterForm__input_error);
    const errorElement = element.querySelector(`.${styles.FooterForm__textError}`);
    if (errorElement) errorElement.textContent = errorMessage;
  }, []);

  const clearError = useCallback((element) => {
    element.classList.remove(styles.FooterForm__input_error);
    const errorElement = element.querySelector(`.${styles.FooterForm__textError}`);
    if (errorElement) errorElement.textContent = '';
  }, []);

  const validateInput = useCallback(
    (e) => {
      const { name, value, parentNode: parent } = e.currentTarget;

      if (name === 'tel' && telTouched) {
        if (value.trim().length > 0 && value.includes('_')) {
          setTelError(ERROR_TEXT.tel);
          setError(parent, ERROR_TEXT.tel);
        } else if (value.trim() === '') {
          setTelError(ERROR_TEXT.empty);
          setError(parent, ERROR_TEXT.empty);
        } else {
          setTelError('');
          clearError(parent);
        }
      } else {
        clearError(parent);
      }
    },
    [clearError, setError, telTouched]
  );

  const handleFocus = useCallback(
    (e) => {
      const { parentNode: parent } = e.currentTarget;
      clearError(parent);
      if (e.currentTarget.name === 'text' && !e.currentTarget.value.trim()) {
        setPlaceholderText(PLACEHOLDER_TEXT.focus);
      }
    },
    [clearError]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.currentTarget;
      if (name === 'text' && !value.trim()) {
        setPlaceholderText(PLACEHOLDER_TEXT.default);
      }
      validateInput(e);
    },
    [validateInput]
  );

  const handleTelFocus = useCallback(() => {
    setTelTouched(true);
  }, []);

  const handleNameInput = (e) => {
    const regex = /^[A-Za-zА-Яа-яЁё\s]+$/;
    if (!regex.test(e.target.value)) {
      e.target.value = e.target.value.replace(/[^A-Za-zА-Яа-яЁё\s]/g, '');
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const telInput = formRef.current.elements.tel;
      validateInput({ currentTarget: telInput });

      if (telInput.value.trim() && !telError) {
        setIsLoading(true);
        const formData = {
          text: formRef.current.elements.text.value,
          name: formRef.current.elements.name.value,
          tel: formRef.current.elements.tel.value,
        };

        try {
          const response = await fetch(`${Host}/api-mail/submitFooterForm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData }),
          });

          if (response.ok) {
            setIsSent(true);
            formRef.current.reset();
            setPlaceholderText(PLACEHOLDER_TEXT.default);
            setTelError('');
            setTelTouched(false);
            dispatch(openModal());
            const previousRoute = location.state?.from || '/';
            navigate(previousRoute, { state: { showModal: true } });
          } else {
            console.error('Ошибка при отправке формы');
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!telInput.value.trim()) {
        setTelError(ERROR_TEXT.empty);
        setError(telInput.parentNode, ERROR_TEXT.empty);
      }
    },
    [telError, validateInput, setError, navigate, dispatch, location.state]
  );


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className={styles.FooterForm}>
      <div className={styles.FooterForm__container}>
        <div className={styles.FooterForm__top}>
          <div className={styles.FooterForm__left}>
            <img src={mark} alt="Mark" />
          </div>
          <div className={styles.FooterForm__right}>
            <div className={styles.FooterForm__subtitle}>Опишите ваш запрос!</div>
            <form ref={formRef} className={styles.FooterForm__form} onSubmit={handleSubmit}>
              <div
                className={`${styles.FooterForm__input} ${styles.FooterForm__input_text}`}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                <textarea maxLength={500} onFocus={handleFocus} onBlur={handleBlur} name="text" placeholder=" " />
                <span className={styles.FooterForm__placeholder}>{placeholderText}</span>
                <label htmlFor="text" className={styles.FooterForm__border}></label>
              </div>
              <div
                className={`${styles.FooterForm__input} ${styles.FooterForm__input_name}`}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                <input
                  name="name"
                  type="text"
                  id="name"
                  placeholder=" "
                  onInput={handleNameInput}
                  onFocus={handleFocus}
                  onBlur={validateInput}
                />
                <span className={styles.FooterForm__placeholder}>Ваше имя</span>
              </div>
              <div
                className={`${styles.FooterForm__input} ${styles.FooterForm__input_tel}`}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                <InputMask
                  mask="+7 (___) ___-__-__"
                  replacement={{ _: /\d/ }}
                  showMask={true}
                  ref={inputRef}
                  onBlur={validateInput}
                  name="tel"
                  placeholder=" "
                  onFocus={handleTelFocus}
                />
                <span className={styles.FooterForm__placeholder}>Телефон</span>
                <span className={styles.FooterForm__textError}>{telError}</span>
              </div>
              <div className={styles.FooterForm__conclusion}>
                <div
                  className={styles.FooterForm__agreement}
                  onMouseEnter={handleMouseEnterFooterMore}
                  onMouseLeave={handleMouseLeaveFooter}>
                  Нажав на кнопку, соглашаюсь на{' '}
                  <a href="./Information" target="_blank">
                    обработку персональных данных
                  </a>
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
      {isLoading && (
        <div className={styles.LoadingOverlay}>
          <LoadingCircle />
        </div>
      )}
    </section>
  );
};

export default FooterForm;
