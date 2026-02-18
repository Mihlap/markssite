import React, { useRef, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { UiMarksInput, UiMarksSelect, UiMarksTextarea, UiPhotoPreview, UiMarksGrayWrap, UiMarksButton, UiMarksConstructorWrap } from '../../ui';
import { monthOptions, yearOptions, typesСonstruction } from '../FormAddEditProject/utils/Time';
import { MEASUREMENT_FIELDS } from '../FormAddEditProject/const/measurement';
import { competenciesOptions, degreeParticipationOptions, statusObjectOptions, stageAwards } from './const/options';

import s from './Styles.module.css';

export default function AddForm({ onValidityChange }) {
  const photoAvaRef = useRef(null);
  const dropPhotoRef = useRef(null);
  const imageOpenRef = useRef(null);
  const imageCloseRef = useRef(null);
  const renderCount = useRef(0);
  const [open, setOpen] = useState(false);
  renderCount.current += 1;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });

  const measurementValues = watch(MEASUREMENT_FIELDS.map((f) => f.name));
  const filledCount = measurementValues.filter((v) => v && String(v).trim() !== '').length;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form id="add-form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      {renderCount.current > 0 && <div>Количество ре-рендеров: {renderCount.current}</div>}
      <UiMarksGrayWrap customStyles={{ padding: '24px 16px 32px 16px' }}>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Название проекта"
              name="title"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="selectCompetencies"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              label="Выбрать компетенции"
              placeholder="Выберите компетенции"
              name="selectCompetencies"
              customStyles={{
                container: s.selectContainer,
              }}
              options={competenciesOptions}
              {...field}
            />
          )}
        />
        <Controller
          name="countryCity"
          label="Страна, город"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Страна, город"
              name="countryCity"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <div className={s.wrapSelects}>
          <Controller
            name="month"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <UiMarksSelect
                name="month"
                label="Месяц"
                placeholder="Месяц"
                error={fieldState.error && 'Обязательное поле'}
                customStyles={{
                  container: s.selectContainer,
                }}
                options={monthOptions}
                {...field}
              />
            )}
          />
          <Controller
            name="year"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <UiMarksSelect
                name="year"
                label="Год"
                placeholder="Год"
                error={fieldState.error && 'Обязательное поле'}
                customStyles={{
                  container: s.selectContainer,
                }}
                options={yearOptions}
                {...field}
              />
            )}
          />
        </div>
        <Controller
          name="viewConstruction"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              name="viewConstruction"
              label="Выберите вид строительства"
              placeholder="Выберите вид строительства"
              customStyles={{
                container: s.selectContainer,
              }}
              options={typesСonstruction}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <div className={s.photoUpload}>
        <Controller
          name="photoAva"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              {value?.length > 0 ? (
                <UiPhotoPreview
                  files={value}
                  variant="single"
                  onRemove={() => {
                    onChange([]);
                    if (photoAvaRef.current) {
                      photoAvaRef.current.value = '';
                    }
                  }}
                />
              ) : (
                <UiMarksInput
                  type="file"
                  name="photoAva"
                  accept="image/*"
                  inputRef={photoAvaRef}
                  label="Загрузите фото превью *для отображения на&nbsp;странице &laquo;Проекты&raquo;"
                  color="grey"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    onChange(file ? [file] : []);
                  }}
                />
              )}
            </>
          )}
        />

        <Controller
          name="dropPhoto"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              {value?.length !== 4 && (
                <UiMarksInput
                  type="file"
                  name="dropPhoto"
                  accept="image/*"
                  multiple
                  inputRef={dropPhotoRef}
                  label="Слайдер *допускается загрузка 4х&nbsp;изображений"
                  color="grey"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;
                    const prev = value || [];
                    const next = [...prev, ...files].slice(0, 4);
                    onChange(next);
                    if (dropPhotoRef.current) {
                      dropPhotoRef.current.value = '';
                    }
                  }}
                />
              )}
              <UiPhotoPreview
                files={value}
                variant="grid-4"
                onRemove={(index) => {
                  const next = (value || []).filter((_, i) => i !== index);
                  onChange(next);
                }}
              />
            </>
          )}
        />
      </div>

      <UiMarksGrayWrap customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Controller
          name="titleTextBlock"
          control={control}
          render={({ field }) => (
            <UiMarksInput
              name="titleTextBlock"
              label="Заголовок текстового блока"
              placeholder="Не более 56 символов"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 56) {
                  field.onChange(value);
                }
              }}
              value={field.value}
              maxLength={56}
            />
          )}
        />
        <Controller
          name="descriptionProject"
          control={control}
          render={({ field }) => (
            <UiMarksTextarea
              name="descriptionProject"
              label="Текстовый блок"
              placeholder="Нет ограничения по символам"
              // btn={true}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <div>
        <p className={s.description}>Заполните 3 значения на выбор</p>
        <UiMarksGrayWrap customStyles={{ padding: '24px 16px 32px 16px' }}>
          {MEASUREMENT_FIELDS.map(({ name, label, measurement }) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <UiMarksInput
                  label={label}
                  name={name}
                  measurement={measurement}
                  disabled={filledCount >= 3 && (!field.value || String(field.value).trim() === '')}
                  {...field}
                />
              )}
            />
          ))}
        </UiMarksGrayWrap>
      </div>
      <UiMarksGrayWrap customStyles={{ padding: '24px 16px 32px 16px' }}>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <UiMarksInput name="location" label="Расположение: Город, улица, номер дома" {...field} />
          )}
        />
        <Controller
          name="degreeParticipation"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              label="Степень участия"
              placeholder="Степень участия"
              name="degreeParticipation"
              customStyles={{
                container: s.selectContainer,
              }}
              options={degreeParticipationOptions}
              {...field}
            />
          )}
        />
        <Controller
          name="statusObject"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              label="Статус объекта"
              placeholder="Статус объекта"
              name="statusObject"
              customStyles={{
                container: s.selectContainer,
              }}
              options={statusObjectOptions}
              {...field}
            />
          )}
        />
        <Controller
          name="customer"
          control={control}
          render={({ field }) => <UiMarksInput name="customer" label="Заказчик" {...field} />}
        />
        <div className={s.linksBlock}>
          <div className={s.linksTitle}>
            <Controller
              name="publication"
              control={control}
              render={({ field }) => (
                <UiMarksInput label="Публикация" placeholder="Публикация" name="publication" {...field} />
              )}
            />
            <Controller
              name="publicationTwo"
              control={control}
              render={({ field }) => (
                <UiMarksInput label="Публикация" placeholder="Публикация2" name="publicationTwo" {...field} />
              )}
            />
          </div>
          <div className={s.linksTitle}>
            <Controller
              name="linkToPublication"
              control={control}
              render={({ field }) => (
                <UiMarksInput
                  label="Ссылк на статью"
                  placeholder="Ссылк на статью"
                  name="linkToPublication"
                  {...field}
                />
              )}
            />
            <Controller
              name="linkToPublicationTwo"
              control={control}
              render={({ field }) => (
                <UiMarksInput
                  label="Ссылк на статью"
                  placeholder="Ссылк на статью2"
                  name="linkToPublicationTwo"
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Controller
          name="awards"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              label="Выберите стадию"
              placeholder="Выберите стадию"
              name="awards"
              customStyles={{
                container: s.selectContainer,
              }}
              options={stageAwards}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <Controller
        name="imageOpen"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            {value?.length > 0 ? (
              <UiPhotoPreview
                files={value}
                variant="single"
                onRemove={() => {
                  onChange([]);
                  if (imageOpenRef.current) {
                    imageOpenRef.current.value = '';
                  }
                }}
              />
            ) : (
              <UiMarksInput
                type="file"
                name="imageOpen"
                accept="image/*"
                inputRef={imageOpenRef}
                label="Открывающая картинка"
                color="grey"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file ? [file] : []);
                }}
              />
            )}
          </>
        )}
      />

      <UiMarksGrayWrap customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Controller
          name="headingTextBlock"
          control={control}
          render={({ field }) => (
            <UiMarksInput
              name="headingTextBlock"
              label="Заголовок текстового блока"
              placeholder="Не более 56 символов"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 56) {
                  field.onChange(value);
                }
              }}
              value={field.value}
              maxLength={56}
            />
          )}
        />
        <Controller
          name="textBlock"
          control={control}
          render={({ field }) => (
            <UiMarksTextarea
              name="textBlock"
              label="Текстовый блок"
              placeholder="Нет ограничения по символам"
              Quill={true}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      {open ? (
        <UiMarksConstructorWrap>
          
        </UiMarksConstructorWrap>
      ) : (
        <UiMarksButton defaultStyle="constructor" size="large" icon onClick={() => setOpen(true)}>
          Добавить блок из библиотеки
        </UiMarksButton>
      )}

      <Controller
        name="photo"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            {value?.length > 0 ? (
              <UiPhotoPreview
                files={value}
                variant="single"
                onRemove={() => {
                  onChange([]);
                  if (imageCloseRef.current) {
                    imageCloseRef.current.value = '';
                  }
                }}
              />
            ) : (
              <UiMarksInput
                type="file"
                name="photo"
                accept="image/*"
                inputRef={imageCloseRef}
                label="Закрывающая картинка"
                color="grey"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file ? [file] : []);
                }}
              />
            )}
          </>
        )}
      />
    </form>
  );
}
