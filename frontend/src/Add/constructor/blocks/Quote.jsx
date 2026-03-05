import React from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksTextarea, UiMarksGrayWrap, UiMarksInput, UiPhotoPreview } from '../../ui';

export default function Quote({ control, index, onRemove }) {
  const imageRef = React.useRef(null);
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 1rem 32px 1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Controller
        name={`constructorBlocks.${index}.title`}
        control={control}
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
        name={`constructorBlocks.${index}.textarea`}
        control={control}
        render={({ field }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.textarea`}
            label="Текстовый блок"
            placeholder="Нет ограничения по символам"
            richText
            color="salmon"
            {...field}
          />
        )}
      />
      <Controller
        name={`constructorBlocks.${index}.image`}
        control={control}
        render={({ field: { onChange, value } }) =>
          value?.length > 0 ? (
            <UiPhotoPreview
              files={value}
              variant="single"
              label="Загрузите изображение"
              color="salmon"
              onRemove={() => {
                onChange([]);
                if (imageRef.current) imageRef.current.value = '';
              }}
            />
          ) : (
            <UiMarksInput
              type="file"
              color="salmon"
              name={`constructorBlocks.${index}.image`}
              label="Загрузите изображение"
              accept="image/*"
              inputRef={imageRef}
              onChange={(e) => {
                const file = e.target.files[0];
                onChange(file ? [file] : []);
              }}
            />
          )
        }
      />
    </UiMarksGrayWrap>
  );
}
