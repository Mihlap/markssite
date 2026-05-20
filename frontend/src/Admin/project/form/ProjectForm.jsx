import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { createProject, updateProject } from '../../../store/Slice/projectSlice';
import { UiMarksInput, UiMarksSelect, UiMarksTextarea, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';
import { monthOptions, yearOptions, typesСonstruction } from './const/Time';
import {
  competenciesOptions,
  degreeParticipationOptions,
  statusObjectOptions,
  stageAwards,
  MEASUREMENT_FIELDS,
  EMPTY_VALUES,
} from './const/options';
import { renameFile, convertOldToNewFormat } from '../../function/index';

import s from './Styles.module.css';
import ConstructorMain from '../../constructor/ConstructorMain';

import { project_items } from '../../constructor/config/config';
import { BLOCK_COMPONENTS } from '../../constructor/blocks';

const ProjectForm = forwardRef(function ProjectForm(
  { onValidityChange, onLoadingChange, editProjectData, onSuccess, onDirtyChange },
  ref
) {
  const dispatch = useDispatch();
  const photoAvaRef = useRef(null);
  const dropPhotoRef = useRef(null);
  const imageOpenRef = useRef(null);
  const imageCloseRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({
    mode: 'onChange',
  });

  const {
    fields: constructorBlocks,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'constructorBlocks',
  });

  const measurementValues = watch(MEASUREMENT_FIELDS.map((f) => f.name));
  const filledCount = measurementValues.filter((v) => v && String(v).trim() !== '').length;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useImperativeHandle(
    ref,
    () => ({
      resetForm: () => reset(EMPTY_VALUES),
    }),
    [reset]
  );

  useEffect(() => {
    if (!editProjectData) {
      reset(EMPTY_VALUES);
      return;
    }

    // Parse monthYear
    const [month, year] = (editProjectData.monthYear || '').trim().split(' ');

    // Parse comma-separated values to select options
    const parseToOptions = (str) =>
      str ? str.split(',').map((item) => ({ value: item.trim(), label: item.trim() })) : [];

    // Convert constructor blocks from old format
    const constructorData = editProjectData.Constructors?.[0]?.data;
    const newFormatBlocks = convertOldToNewFormat(constructorData);

    reset({
      title: editProjectData.title || '',
      countryCity: editProjectData.countryCity || '',
      month: month ? { value: month, label: month } : null,
      year: year ? { value: year, label: year } : null,
      selectCompetencies: parseToOptions(editProjectData.selectCompetencies),
      viewConstruction: parseToOptions(editProjectData.viewConstruction),
      titleTextBlock: editProjectData.titleTextBlock || '',
      descriptionProject: editProjectData.descriptionProject || '',
      totalArea: editProjectData.totalArea || '',
      siteArea: editProjectData.siteArea || '',
      floors: editProjectData.floors || '',
      altitude: editProjectData.altitude || '',
      constructionVolume: editProjectData.constructionVolume || '',
      numberOfLanes: editProjectData.numberOfLanes || '',
      long: editProjectData.long || '',
      location: editProjectData.location || '',
      degreeParticipation: parseToOptions(editProjectData.degreeParticipation),
      statusObject: editProjectData.statusObject
        ? { value: editProjectData.statusObject, label: editProjectData.statusObject }
        : null,
      customer: editProjectData.customer || '',
      publication: editProjectData.publication || '',
      linkToPublication: editProjectData.linkToPublication || '',
      publicationTwo: editProjectData.publicationTwo || '',
      linkToPublicationTwo: editProjectData.linkToPublicationTwo || '',
      awards: parseToOptions(editProjectData.awards),
      headingTextBlock: editProjectData.headingTextBlock || '',
      textBlock: editProjectData.textBlock || '',
      photoAva: editProjectData.imageProject ? [editProjectData.imageProject] : [],
      dropPhoto: editProjectData.imageTitle
        ? editProjectData.imageTitle
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean)
        : [],
      imageOpen: editProjectData.imageOpen ? [editProjectData.imageOpen] : [],
      imageClose: editProjectData.imageClose ? [editProjectData.imageClose] : [],
      constructorBlocks: newFormatBlocks,
    });

  }, [editProjectData, reset]);

  const toOldFormat = (block) => {
    const processFiles = (files) => {
      if (!Array.isArray(files)) return [];
      return files.map((file) => {
        if (file instanceof File) {
          return renameFile(file);
        }
        return file;
      });
    };

    switch (block.type) {
      case 'imageWithDesc':
        return [
          { type: 'file', label: 'Картинка с описанием', value: processFiles(block.image) },
          { type: 'text', label: 'Описание картинки', value: block.description || '' },
        ];
      case 'titleWithDesc':
        return [
          { type: 'text', label: 'Заголовок', value: block.title || '' },
          { type: 'text', label: 'Текстовый блок', value: block.description || '' },
        ];
      case 'video':
        return [{ type: 'text', label: 'Ссылка на видеоролик', value: block.description || '' }];
      case 'videoUpload':
        return [{ type: 'file', label: 'Видео файл', value: processFiles(block.video || []) }];
      case 'videoBlock':
        return [
          { type: 'file', label: 'Видео блок', value: processFiles(block.video || []) },
          { type: 'text', label: 'Ссылка на видеоролик блок', value: block.description || '' },
        ];
      case 'threeImages':
        return [{ type: 'file', label: 'Блок 3 картинки', value: processFiles(block.image) }];
      case 'twoImages':
        return [{ type: 'file', label: 'Блок 2е вертикальные картинки', value: processFiles(block.image) }];
      case 'slider':
        return [
          { type: 'file', label: 'Слайдер *допускается загрузка 8ми изображений', value: processFiles(block.image) },
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
      let hasBlockError = false;
      (data.constructorBlocks || []).forEach((block, i) => {
        if (block.type === 'imageWithDesc') {
          if (!block.image?.length) {
            setError(`constructorBlocks.${i}.image`, { type: 'custom', message: 'Обязательно для загрузки' });
            hasBlockError = true;
          }
          return;
        }
      });
      if (hasBlockError) return;
    const oldFormatBlocks = (data.constructorBlocks || []).map(toOldFormat);

    const formattedData = {
      title: data.title || '',
      selectCompetencies: Array.isArray(data.selectCompetencies)
        ? data.selectCompetencies.map((o) => o.label).join(',')
        : '',
      countryCity: data.countryCity || '',
      monthYear: [data.month?.value, data.year?.value].filter(Boolean).join(' '),
      viewConstruction: Array.isArray(data.viewConstruction) ? data.viewConstruction.map((o) => o.label).join(',') : '',
      titleTextBlock: data.titleTextBlock || '',
      descriptionProject: data.descriptionProject || '',
      totalArea: data.totalArea || '',
      siteArea: data.siteArea || '',
      floors: data.floors || '',
      altitude: data.altitude || '',
      constructionVolume: data.constructionVolume || '',
      numberOfLanes: data.numberOfLanes || '',
      long: data.long || '',
      location: data.location || '',
      degreeParticipation: Array.isArray(data.degreeParticipation)
        ? data.degreeParticipation.map((o) => o.label).join(',')
        : '',
      statusObject: data.statusObject?.label || '',
      customer: data.customer || '',
      publication: data.publication || '',
      linkToPublication: data.linkToPublication || '',
      publicationTwo: data.publicationTwo || '',
      linkToPublicationTwo: data.linkToPublicationTwo || '',
      awards: Array.isArray(data.awards) ? data.awards.map((o) => o.label).join(',') : '',
      headingTextBlock: data.headingTextBlock || '',
      textBlock: data.textBlock || '',
      photoAva: data.photoAva || [],
      dropPhoto: data.dropPhoto || [],
      imageOpen: data.imageOpen || [],
      imageClose: data.imageClose || [],
      dynamicBlocks: oldFormatBlocks,
    };

    if (editProjectData?.id) {
      await dispatch(updateProject(editProjectData.id, formattedData));
    } else {
      await dispatch(createProject(formattedData));
    }
    reset();
    onSuccess?.();
  };

  return (
    <form id="add-form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 16px' }}>
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
                label="Загрузите фото превью *для отображения на&nbsp;странице &laquo;Проекты&raquo;"
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

      <div className={s.photoUpload}>
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
                // label="Слайдер *допускается загрузка 4х&nbsp;изображений"
                label={value?.length === 4 ? 'Слайдер *допускается загрузка 4х изображений' : ''}
              />
            </>
          )}
        />
      </div>

      <UiMarksGrayWrap customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Controller
          name="titleTextBlock"
          control={control}
          rules={{ required: true }}
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
          rules={{ required: true }}
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
        <UiMarksGrayWrap customStyles={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
      <UiMarksGrayWrap customStyles={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                  label="Ссылка на статью"
                  placeholder="Ссылка на статью"
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
                  label="Ссылка на статью"
                  placeholder="Ссылка на статью2"
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
              isMulti
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
                label="Открывающая картинка"
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
              richText
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <ConstructorMain items={project_items} onSelect={(item) => append({ type: item.id })} />

      {constructorBlocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;
        return <Component key={block.id} control={control} index={index} onRemove={() => remove(index)} />;
      })}

      <Controller
        name="imageClose"
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
                label="Закрывающая картинка"
              />
            ) : (
              <UiMarksInput
                type="file"
                name="imageClose"
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
});

export default ProjectForm;
