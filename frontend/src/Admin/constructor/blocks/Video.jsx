import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiMarksGrayWrap } from '../../ui';

export default function Video({ control, index, onRemove }) {
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{
        padding: '36px 16px 32px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
      <Controller
        name={`constructorBlocks.${index}.description`}
        control={control}
        render={({ field }) => (
          <UiMarksInput
            color="salmon"
            name={`constructorBlocks.${index}.description`}
            label="Ссылка на видеоролик"
            placeholder="Ссылка на видеоролик"
            bordered
            {...field}
          />
        )}
      />
    </UiMarksGrayWrap>
  );
}
