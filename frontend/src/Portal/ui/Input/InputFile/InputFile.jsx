import React, { useRef, useState } from 'react';
import styles from './styles.module.css';

const buildDefaultValidator = (maxFiles, requiredMessage, maxFilesMessage, invalidMessage) => {
  return (files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return requiredMessage;
    if (maxFiles && list.length > maxFiles) return maxFilesMessage;
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const isAllowed = (file) => {
      if (file.type?.startsWith('image/')) return true;
      if (
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type)
      ) {
        return true;
      }
      const name = file.name?.toLowerCase() || '';
      return allowedExtensions.some((ext) => name.endsWith(ext));
    };
    if (list.some((file) => !isAllowed(file))) {
      return invalidMessage;
    }
    return true;
  };
};

export default function InputFile({
  register,
  name = 'resumeFiles',
  setValue,
  clearErrors,
  error,
  accept = '.pdf,.doc,.docx,image/*',
  multiple = true,
  maxFiles = 2,
  label = 'Прикрепить файл',
  variant = 'full',
  validate,
  requiredMessage = 'Файл обязателен',
  maxFilesMessage = 'Можно загрузить только два файла',
  invalidMessage = 'Можно загрузить только PDF, DOC, DOCX или картинки',
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const resumeFilesRegister = register(name, {
    required: requiredMessage,
    validate:
      validate || buildDefaultValidator(maxFiles, requiredMessage, maxFilesMessage, invalidMessage),
  });

  const applyFilesToInput = (files) => {
    if (!fileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const limit = maxFiles && maxFiles > 0 ? maxFiles : files.length;
    const nextFiles = files.slice(0, limit);
    setSelectedFiles(nextFiles);
    if (files.length !== nextFiles.length) {
      applyFilesToInput(nextFiles);
    }
  };

  const handleFileRemove = (index) => {
    const nextFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
    setSelectedFiles(nextFiles);
    if (setValue) {
      setValue(name, nextFiles, { shouldDirty: true, shouldValidate: true });
    }
    if (clearErrors) {
      clearErrors(name);
    }
    applyFilesToInput(nextFiles);
  };

  return (
    <div className={styles.wrap} data-has-files={selectedFiles.length > 0} data-variant={variant}>
      {selectedFiles.length > 0 && (
        <div className={styles.previewWrap} data-variant={variant}>
          {selectedFiles.map((file, index) => (
            <button
              key={`${file.name}-${file.lastModified}`}
              type="button"
              onClick={() => handleFileRemove(index)}
              aria-label="Удалить файл"
              className={styles.preview}>
              <span className={styles.fileName} title={file.name}>
                {file.name}
              </span>
            </button>
          ))}
        </div>
      )}
      <label className={styles.label}>
        <input
          className={styles.input}
          type="file"
          multiple={multiple}
          accept={accept}
          {...resumeFilesRegister}
          onChange={(event) => {
            resumeFilesRegister.onChange(event);
            handleFileChange(event);
          }}
          ref={(node) => {
            resumeFilesRegister.ref(node);
            fileInputRef.current = node;
          }}
        />
        <span className={`${styles.button} ${variant === 'simple' ? styles.buttonSimple : styles.buttonFull}`}>
          {label}
        </span>
        {error && <span className={styles.error}>{error}</span>}
      </label>
    </div>
  );
}
