import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import 'react-phone-number-input/style.css';
import styles from './VacancyFormContactUniversal.module.css';
import { phoneRegex, directionOptions, maskOptions } from './const/index.js';
import Input from '../../Portal/ui/Input/Input.jsx';
import MaskedInput from '../../Portal/ui/Input/MaskedInput.jsx';

const apiBase = process.env.REACT_APP_SERVER_HOST || '';

const VacancyFormContactUniversal = ({ variant: variantProp = 'full' }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      direction: null,
      letter: '',
      resume: '',
      resumeFiles: [],
    },
  });

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
        const response = await fetch(`${apiBase}/api-mail/portalSubmitForm/v2`, {
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
      } catch (error) {
        console.error('Ошибка при отправке формы', error);
      }
    },
    [reset, setError]
  );

  const formClassName = variantProp === 'full' ? styles.fullForm : styles.simpleForm;

  return (
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <Input
        label="Ваше имя и фамилия"
        placeholder=" "
        // maxLength={50}
        {...register('name', {
          required: 'Обязательное поле',
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
        rules={{
          required: 'Обязательное поле',
          validate: (value) => phoneRegex.test(value) || 'Некорректный телефон',
        }}
        render={({ field, fieldState }) => (
          <MaskedInput
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

      {/* <Controller
        name="direction"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={directionOptions}
            placeholder="Выбрать направление"
            isClearable
            isSearchable={false}
          />
        )}
      /> */}

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

      <label>
        <input type="file" multiple {...register('resumeFiles', { required: 'Файл обязателен' })} />
        {errors.resumeFiles && <span>{errors.resumeFiles.message}</span>}
      </label>

      <button
        title="Заполните обязательные поля"
        disabled={!isValid}
        className={`${styles['form-btn']} ${isValid ? styles.active : styles.disabled}`}
        type="submit">
        Отправить
      </button>
    </form>
  );
};

export default React.memo(VacancyFormContactUniversal);
