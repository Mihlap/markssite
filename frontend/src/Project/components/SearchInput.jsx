import { useState, useEffect } from 'react';
import styles from '../styles/Project.module.css';

export default function SearchInput({ onSearch, resetKey }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [resetKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <input
      className={styles.address_and_city_choose_location}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.target.blur();
        }
      }}
      maxLength="50"
      autoComplete="off"
      placeholder=""
    />
  );
}
