import React from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksTextarea, UiMarksGrayWrap, UiMarksInput, UiPhotoPreview } from '../../ui';

export default function TextWithBackg({ control, index, onRemove }) {
  const imageRef = React.useRef(null);
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 1rem 32px 1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Controller
        name={`constructorBlocks.${index}.image`}
        control={control}
        render={({ field: { onChange, value } }) =>
          value?.length > 0 ? (
            <UiPhotoPreview
              files={value}
              variant="portrait"
              label="Фото человека"
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
              info
              name={`constructorBlocks.${index}.image`}
              label="Фото человека"
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
      <Controller
        name={`constructorBlocks.${index}.textarea`}
        control={control}
        render={({ field }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.textarea`}
            label="Текстовый блок с фоном"
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
