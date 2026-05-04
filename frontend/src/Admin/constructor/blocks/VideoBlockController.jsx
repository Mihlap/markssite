import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import VideoBlock from './VideoBlock';

export default function VideoBlockController({ control, index, onRemove }) {
  const file = useWatch({ control, name: `constructorBlocks.${index}.video` })?.[0] ?? null;
  const url = useWatch({ control, name: `constructorBlocks.${index}.description` }) ?? '';

  return (
    <Controller
      name={`constructorBlocks.${index}.video`}
      control={control}
      render={({ field: { onChange: onVideoChange } }) => (
        <Controller
          name={`constructorBlocks.${index}.description`}
          control={control}
          render={({ field: { onChange: onUrlChange } }) => (
            <VideoBlock
              file={file}
              url={url}
              onFileChange={(f) => onVideoChange(f ? [f] : [])}
              onUrlChange={onUrlChange}
              onRemove={onRemove}
            />
          )}
        />
      )}
    />
  );
}
