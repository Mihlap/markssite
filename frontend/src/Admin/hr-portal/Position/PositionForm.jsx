import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { UiMarksInput, UiMarksSelect, UiMarksTextarea, UiMarksGrayWrap } from '../../ui';
import { addVacancy, editVacancy } from '../../../store/Slice/vacanciesSlice';
import { selectBlocks } from '../const/utils';

import s from './Styles.module.css';

const getOptions = (name) => selectBlocks.find((b) => b.name === name)?.options || [];

const toSelectOption = (val) => (val ? { value: val, label: val } : null);

const parseMultiOptions = (str) =>
  str
    ? str
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => ({ value: v, label: v }))
    : [];

const EMPTY_VALUES = {
  title: '',
  direction: null,
  experience: null,
  location: null,
  busyness: null,
  workMode: null,
  skills: [],
  benefits: [],
  textBlock1: '',
  textBlock2: '',
  textBlock3: '',
};

const PositionForm = forwardRef(function PositionForm(
  { onValidityChange, onLoadingChange, editVacancyData, onSuccess, onDirtyChange, selectedFilter, selectedlabel },
  ref
) {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useImperativeHandle(ref, () => ({ resetForm: () => reset(EMPTY_VALUES) }), [reset]);

  useEffect(() => {
    if (!editVacancyData) {
      reset(EMPTY_VALUES);
      return;
    }
    reset({
      title: editVacancyData.title || '',
      direction: toSelectOption(editVacancyData.direction),
      experience: toSelectOption(editVacancyData.experience),
      location: toSelectOption(editVacancyData.locationStaff),
      busyness: toSelectOption(editVacancyData.busyness),
      workMode: toSelectOption(editVacancyData.modeOperating),
      skills: parseMultiOptions(editVacancyData.skills),
      benefits: parseMultiOptions(editVacancyData.advantages),
      textBlock1: editVacancyData.searchStaff || '',
      textBlock2: editVacancyData.haveToWork || '',
      textBlock3: editVacancyData.requirements || '',
    });
  }, [editVacancyData, reset]);

  const onSubmit = async (data) => {
    const type = selectedFilter === 'Вакансии' ? 'вакансия' : 'стажировка';
    const skillsArr = (data.skills || []).map((o) => o.value);
    const benefitsArr = (data.benefits || []).map((o) => o.value);

    const formattedData = {
      title: data.title || '',
      direction: data.direction?.value || '',
      experience: data.experience?.value || '',
      location: data.location?.value || '',
      busyness: data.busyness?.value || '',
      workMode: data.workMode?.value || '',
      skills: skillsArr,
      benefits: benefitsArr,
      textBlock1: data.textBlock1 || '',
      textBlock2: data.textBlock2 || '',
      textBlock3: data.textBlock3 || '',
      type,
    };

    if (editVacancyData) {
      await dispatch(editVacancy({ id: editVacancyData.id, formData: formattedData }));
    } else {
      await dispatch(addVacancy(formattedData));
    }

    reset();
    onSuccess?.();
  };

  return (
    <form id="vacancy-form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 16px' }}>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label={selectedlabel}
              name="title"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="direction"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksSelect
              label="Направление"
              placeholder="Направление"
              name="direction"
              customStyles={{ container: s.selectContainer }}
              options={getOptions('direction')}
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="experience"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksSelect
              label="Опыт работы"
              placeholder="Опыт работы"
              name="experience"
              customStyles={{ container: s.selectContainer }}
              options={getOptions('experience')}
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="location"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksSelect
              label="Локация"
              placeholder="Локация"
              name="location"
              customStyles={{ container: s.selectContainer }}
              options={getOptions('location')}
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="busyness"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksSelect
              label="Занятость"
              placeholder="Занятость"
              name="busyness"
              customStyles={{ container: s.selectContainer }}
              options={getOptions('busyness')}
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="workMode"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksSelect
              label="Режим работы"
              placeholder="Режим работы"
              name="workMode"
              customStyles={{ container: s.selectContainer }}
              options={getOptions('workMode')}
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              label="Ключевые навыки"
              placeholder="Ключевые навыки"
              name="skills"
              customStyles={{ container: s.selectContainer }}
              options={getOptions('skills')}
              {...field}
            />
          )}
        />
        <Controller
          name="benefits"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              label="Плюсы работы"
              placeholder="Плюсы работы"
              name="benefits"
              customStyles={{ container: s.selectContainer }}
              options={getOptions('benefits')}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <UiMarksGrayWrap customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Controller
          name="textBlock1"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksTextarea
              name="textBlock1"
              label="Мы ищем"
              placeholder="Не более 300 символов"
              richText
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <UiMarksGrayWrap customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Controller
          name="textBlock2"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksTextarea
              name="textBlock2"
              label="Вам предстоит"
              placeholder="Нет ограничения по символам"
              richText
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <UiMarksGrayWrap customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Controller
          name="textBlock3"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksTextarea
              name="textBlock3"
              label="Требования"
              placeholder="Нет ограничения по символам"
              richText
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>
    </form>
  );
});

export default PositionForm;
