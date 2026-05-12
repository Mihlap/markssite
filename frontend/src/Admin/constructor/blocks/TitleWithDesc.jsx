import React from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiMarksTextarea, UiMarksGrayWrap } from '../../ui';

export default function TitleWithDesc({ control, index, onRemove }) {
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{
        padding: '1rem',
        paddingTop: '38px',
        paddingBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
      <Controller
        name={`constructorBlocks.${index}.title`}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <UiMarksInput
            color="salmon"
            name={`constructorBlocks.${index}.title`}
            label="Заголовок"
            placeholder="Не более 56 символов"
            onChange={(e) => {
              if (e.target.value.length <= 56) field.onChange(e.target.value);
            }}
            value={field.value}
            maxLength={56}
          />
        )}
      />
      <Controller
        name={`constructorBlocks.${index}.description`}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.description`}
            label="Описание"
            placeholder="Нет ограничения по символам"
            richText
            color="salmon"
            {...field}
          />
        )}
      />
    </UiMarksGrayWrap>
  );
}
