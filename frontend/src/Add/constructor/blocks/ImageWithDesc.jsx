import React from 'react'
import { UiMarksInput, UiMarksSelect, UiMarksTextarea, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';
 
export default function ImageWithDesc() {
    return (
      <UiMarksGrayWrap>
        {/* можно загрузить одну фотку */}
        <UiMarksInput />

        {/* тест */}
        <UiMarksInput />
      </UiMarksGrayWrap>
    );
}
