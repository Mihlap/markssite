import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import 'react-phone-number-input/style.css';
import styles from './VacancyFormContactUniversal.module.css';
import { phoneRegex, directionOptions, maskOptions } from './const/index.js';
import Input from '../../Portal/ui/Input/Input.jsx';

const apiBase = process.env.REACT_APP_SERVER_HOST || '';

const VacancyFormContactUniversal = ({ variant: variantProp = 'full' }) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
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

  const onSubmit = ((data) => {
console.log(data);
  })

  // const onSubmit = useCallback(
  //   async (data) => {
  //     const formData = new FormData();

  //     formData.append('name', data.name || '');
  //     formData.append('phone', data.phone || '');
  //     formData.append('city', data.city || '');
  //     formData.append('choose', data.direction?.value || '');
  //     formData.append('letter', data.letter || '');
  //     formData.append('resume', data.resume || '');

  //     if (data.resumeFiles?.length) {
  //       Array.from(data.resumeFiles).forEach((file) => {
  //         formData.append('resumeFiles', file);
  //       });
  //     }

  //     try {
  //       const response = await fetch(`${apiBase}/api-mail/portalSubmitForm/v2`, {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       const payload = await response.json().catch(() => ({}));

  //       if (!response.ok) {
  //         if (payload?.errors) {
  //           Object.entries(payload.errors).forEach(([field, message]) => {
  //             setError(field, { type: 'server', message });
  //           });
  //         }
  //         return;
  //       }

  //       reset();
  //     } catch (error) {
  //       console.error('Ошибка при отправке формы', error);
  //     }
  //   },
  //   [reset, setError]
  // );

  const formClassName = variantProp === 'full' ? styles.fullForm : styles.simpleForm;
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const resumeFilesRegister = register('resumeFiles', {
    required: 'Файл обязателен',
    validate: (files) => {
      const file = files?.[0];
      if (!file) return 'Файл обязателен';
      if (files.length > 1) return 'Можно загрузить только один файл';
      if (file.type?.startsWith('image/')) return 'Изображения не принимаются';
      return true;
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setValue('resumeFiles', [], { shouldDirty: true, shouldValidate: true });
    clearErrors('resumeFiles');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <Input
        label="Ваше имя и фамилия"
        placeholder=" "
        // maxLength={50}
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
        // rules={{
        //   required: 'Заполните поле',
        //   validate: (value) => phoneRegex.test(value) || 'Некорректный телефон',
        // }}
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
      <div className={styles.fileWrap}>
        {selectedFile && (
          <button type="button" onClick={handleFileRemove} aria-label="Удалить файл" className={styles.filePreview}>
            <span className={styles.fileName}>{selectedFile.name}</span>
          </button>
        )}
        <label className={styles.fileLabel}>
          <input
            className={styles.inputFile}
            type="file"
            accept=".pdf,.doc,.docx,.rtf,.odt,.txt,.ppt,.pptx,.xls,.xlsx"
            {...resumeFilesRegister}
            onChange={(event) => {
              resumeFilesRegister.onChange(event);
              handleFileChange(event);
            }}
            ref={(node) => {
              resumeFilesRegister.ref(node);
              fileInputRef.current = node;
            }}
          />
          <span className={styles.fileButton}>Прикрепить файл</span>
          {errors.resumeFiles && <span className={styles.fileError}>{errors.resumeFiles.message}</span>}
        </label>
      </div>

      <input
        value="Откликнутся на вакансию"
        title="Заполните обязательные поля"
        disabled={!isValid}
        className={`${styles.formBtn} ${isValid ? styles.active : styles.disabled}`}
        type="submit"
      />
    </form>
  );
};

export default React.memo(VacancyFormContactUniversal);
