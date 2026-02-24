import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';

export default function ThreeImages({ control, index, onRemove }) {
  const imageRef = useRef(null);
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 16px 32px 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Controller
        name={`constructorBlocks.${index}.image`}
        control={control}
        render={
          ({ field: { onChange, value } }) => (
            <>
              {value?.length !== 3 && (
                <UiMarksInput
                  type="file"
                  color="salmon"
                  name={`constructorBlocks.${index}.image`}
                  label="Блок 3 картинки"
                  accept="image/*"
                  multiple
                  inputRef={imageRef}
                  onChange={(e) => {
                    const files = Array.from(e.target.files).slice(0, 3);
                    onChange(files.length > 0 ? files : []);
                  }}
                      />
                  )}
              <UiPhotoPreview
                files={value}
                variant="grid-3"
                label={value?.length === 3 ? 'Блок 3 картинки' : undefined}
                color="salmon"
                onRemove={(i) => {
                  const newFiles = value.filter((_, idx) => idx !== i);
                  onChange(newFiles);
                  if (newFiles.length === 0 && imageRef.current) imageRef.current.value = '';
                }}
                customStyles={value?.length !== 3 ? { paddingTop: '0.5rem' } : null}
              />
            </>
          )
        }
      />
    </UiMarksGrayWrap>
  );
}
