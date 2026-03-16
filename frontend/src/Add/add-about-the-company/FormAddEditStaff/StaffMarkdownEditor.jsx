import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uploadStaffMarkdownFile, deleteStaffMarkdownFile } from '../../../store/Slice/StaffSliceNew';
import { UiMarksMarkDown } from '../../ui';

export default function StaffMarkdownEditor({ value, onChange, onTempFilesChange, onUploadFile, onDeleteFile }) {
  const dispatch = useDispatch();

  const handleUpload = useCallback(
    (file) => (onUploadFile ? onUploadFile(file) : dispatch(uploadStaffMarkdownFile(file)).unwrap()),
    [onUploadFile, dispatch]
  );

  const handleDelete = useCallback(
    (url) => (onDeleteFile ? onDeleteFile(url) : dispatch(deleteStaffMarkdownFile(url)).unwrap()),
    [onDeleteFile, dispatch]
  );

  return (
    <UiMarksMarkDown
      value={value}
      onChange={onChange}
      onUploadFile={handleUpload}
      onDeleteFile={handleDelete}
      onTempFilesChange={onTempFilesChange}
      color="salmon"
    />
  );
}
