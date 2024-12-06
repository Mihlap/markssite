import React, { useState } from 'react';
import styles from './FileUploader.module.scss';

export default function FileUploader({ label, name }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setFiles(fileList);
  };

  return (
    <div className={styles.fileUploader}>
      <label className={styles.label}>
        {label}
        <input type="file" name={name} onChange={handleFileChange} multiple />
      </label>
      <div className={styles.preview}>
        {files.map((file, index) => (
          <div key={index} className={styles.filePreview}>
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}
