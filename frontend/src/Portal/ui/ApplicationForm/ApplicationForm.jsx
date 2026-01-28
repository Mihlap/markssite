import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useIsInternship } from './hooks/useIsInternship';
import { directionOptions, maskOptions } from './const/index.js';
import Input from '../Input/Input.jsx';
import InputFile from '../Input/InputFile/InputFile.jsx';
import Select from '../Select/Select.jsx';
import telegramIcon from './icons/telegram.svg';

import styles from './styles.module.css';

const ApplicationForm = ({ variant: variantProp = 'full', initialDirection }) => {
  console.log(initialDirection);
  const defaultDirection = useMemo(
    () => directionOptions.find((opt) => opt.value === initialDirection) || null,
    [initialDirection]
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    reset,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      direction: defaultDirection,
      letter: '',
      resume: '',
      resumeFiles: [],
    },
  });

  const isInternship = useIsInternship();
  const submitButtonText = isInternship ? 'Откликнутся на стажировку' : 'Откликнутся на вакансию';

  useEffect(() => {
    if (initialDirection) {
      const option = directionOptions.find((opt) => opt.value === initialDirection);
      if (option) {
        setValue('direction', option);
      }
    }
  }, [initialDirection, setValue]);

  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();

      formData.append('name', data.name || '');
      formData.append('phone', data.phone || '');
      formData.append('city', data.city || '');
      formData.append('choose', data.direction?.value || '');
      formData.append('letter', data.letter || '');
      formData.append('resume', data.resume || '');

      if (data.resumeFiles?.length) {
        Array.from(data.resumeFiles).forEach((file) => {
          formData.append('resumeFiles', file);
        });
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_HOST}/api-mail/portalSubmitForm/v2`, {
          method: 'POST',
          body: formData,
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (payload?.errors) {
            Object.entries(payload.errors).forEach(([field, message]) => {
              setError(field, { type: 'server', message });
            });
          }
          return;
        }

        reset();
        setFormKey((prev) => prev + 1);
        setShowSuccess(true);
         if (window.ym) {
           window.ym(95967240, 'reachGoal', 'form2_done');
         } else {
           console.warn('Yandex.Metrika is not available');
         }
      } catch (error) {
        console.error('Ошибка при отправке формы', error);
      }
    },
    [reset, setError]
  );

  const formClassName = variantProp === 'full' ? styles.fullForm : styles.simpleForm;
  const resumeFiles = watch('resumeFiles');
  const [formKey, setFormKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      {showSuccess && (
        <div className={styles.overlay} onClick={() => setShowSuccess(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalTitle}>Спасибо за отклик!</p>
            <p className={styles.modalText}>
              Мы изучим информацию <br /> и свяжемся с вами
            </p>
            <button type="button" className={styles.modalButton} onClick={() => setShowSuccess(false)} />
          </div>
        </div>
      )}
      <form className={formClassName} onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {variantProp === 'full' ? (
          <>
            <div className={styles.columnsWrap}>
              <div className={styles.leftColumn}>
                <Input
                  label="Ваше имя и фамилия"
                  placeholder=" "
                  {...register('name', {
                    required: 'Заполните поле',
                    maxLength: {
                      value: 50,
                      message: 'Максимум 50 символов',
                    },
                  })}
                  error={errors.name?.message}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Телефон"
                      mask={maskOptions.mask}
                      replacement={maskOptions.replacement}
                      autoComplete="off"
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Input
                  label="Город"
                  placeholder=" "
                  {...register('city', {
                    maxLength: {
                      value: 25,
                      message: 'Максимум 25 символов',
                    },
                  })}
                  error={errors.city?.message}
                />
              </div>

              <div className={styles.rightColumn}>
                <Controller
                  name="direction"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={directionOptions}
                      placeholder="Указанное направление"
                      isClearable
                      isSearchable={false}
                      variant={variantProp}
                    />
                  )}
                />

                <Input
                  label="Сопроводительное письмо"
                  placeholder=" "
                  {...register('letter', {
                    maxLength: {
                      value: 500,
                      message: 'Максимум 500 символов',
                    },
                  })}
                  error={errors.letter?.message}
                />

                <Input
                  label="Ссылка на резюме/портфолио"
                  placeholder=" "
                  {...register('resume', {
                    maxLength: {
                      value: 500,
                      message: 'Максимум 500 символов',
                    },
                  })}
                  error={errors.resume?.message}
                />
                <InputFile
                  key={formKey}
                  register={register}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  error={errors.resumeFiles?.message}
                  variant={variantProp}
                />
              </div>
            </div>
            <div className={styles.formFooter}>
              <div>
                <div className={styles.agreement_vacancy} data-max-files={resumeFiles?.length === 2}>
                  Нажав на кнопку, соглашаюсь на{' '}
                  <Link to="../Information" target="blank" className={styles.agreement_vacancy_link}>
                    обработку
                    <br /> персональных данных
                  </Link>
                </div>

                <input
                  value={submitButtonText}
                  title="Заполните обязательные поля"
                  disabled={!isValid}
                  className={`${styles.formBtn} ${isValid ? styles.active : styles.disabled}`}
                  type="submit"
                />
              </div>
              <div className={styles.social}>
                <p className={styles.socialTitle}>Для соискателей</p>
                <div className={styles.socialContact}>
                  <div className={styles.socialWrap}>
                    <a href="mailto:hr@marksgroup.ru" className={styles.socialEmail}>
                      hr@marksgroup.ru
                    </a>
                    <a href="tel:+74951201226" className={styles.socialPhone}>
                      +7 (495) 120-12-26
                    </a>
                  </div>
                  <Link className={styles.socialIcon} to="https://t.me/marks_career">
                    <img src={telegramIcon} alt="иконка телеграма" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.wrap}>
              <Input
                label="Ваше имя и фамилия"
                placeholder=" "
                {...register('name', {
                  required: 'Заполните поле',
                  maxLength: {
                    value: 50,
                    message: 'Максимум 50 символов',
                  },
                })}
                error={errors.name?.message}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="Телефон"
                    mask={maskOptions.mask}
                    replacement={maskOptions.replacement}
                    autoComplete="off"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Input
                label="Сопроводительное письмо"
                placeholder=" "
                {...register('letter', {
                  maxLength: {
                    value: 500,
                    message: 'Максимум 500 символов',
                  },
                })}
                error={errors.letter?.message}
              />

              <Input
                label="Ссылка на резюме/портфолио"
                placeholder=" "
                {...register('resume', {
                  maxLength: {
                    value: 500,
                    message: 'Максимум 500 символов',
                  },
                })}
                error={errors.resume?.message}
              />
            </div>

            <InputFile
              key={formKey}
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              error={errors.resumeFiles?.message}
              variant={variantProp}
            />

            <div className={styles.agreement_vacancy} data-max-files={resumeFiles?.length === 2}>
              Нажав на кнопку, соглашаюсь на{' '}
              <Link to="../Information" target="blank" className={styles.agreement_vacancy_link}>
                обработку
                <br /> персональных данных
              </Link>
            </div>

            <input
              data-variant="simple"
              value={submitButtonText}
              title="Заполните обязательные поля"
              disabled={!isValid}
              className={`${styles.formBtn} ${isValid ? styles.active : styles.disabled}`}
              type="submit"
            />
          </>
        )}
      </form>
    </>
  );
};

export default React.memo(ApplicationForm);
