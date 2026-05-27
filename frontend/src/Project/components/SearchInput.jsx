import { useState, useRef } from 'react';
import { ALLWORDS } from '../const';
 
import s from '../styles/SearchInput.module.css';

const allSuggestions = Object.values(ALLWORDS).flat();

const highlightMatch = (text, query) => {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className={s.highlight}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
};

export default function SearchInput({ onSearch }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const text = e.target.value;
    setValue(text);
    setActiveIndex(-1);
    if (!text.trim()) {
      setSuggestions([]);
      onSearch('');
      return;
    }
    setSuggestions(allSuggestions.filter((s) => s.toLowerCase().includes(text.trim().toLowerCase())));
  };

  const submit = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setValue(trimmed);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submit(activeIndex >= 0 && suggestions[activeIndex] ? suggestions[activeIndex] : value);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className={s.wrap}>
      <svg className={s.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8.00293 0.00878906C11.5785 0.189979 14.4219 3.14696 14.4219 6.76758L14.4131 7.11523C14.3159 9.03249 13.4193 10.7375 12.0518 11.9082L14.7266 14.583C15.0193 14.8759 15.0194 15.3507 14.7266 15.6436C14.4337 15.9364 13.9589 15.9362 13.666 15.6436L10.7881 12.7656C9.85131 13.2559 8.78589 13.5341 7.65527 13.5342L7.30664 13.5254C3.84638 13.35 1.07183 10.5755 0.896484 7.11523L0.887695 6.76758C0.887695 3.03021 3.9179 0 7.65527 0L8.00293 0.00878906ZM7.65527 1.5C4.74633 1.5 2.3877 3.85863 2.3877 6.76758C2.38795 9.67631 4.74649 12.0342 7.65527 12.0342C10.5638 12.0339 12.9216 9.67615 12.9219 6.76758C12.9219 3.85879 10.564 1.50025 7.65527 1.5Z"
          fill="currentColor"
        />
      </svg>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder=" "
        autoComplete="off"
        className={s.input}
      />
      <label htmlFor="search-input" className={s.label}>
        Введите город или адрес
      </label>
      {suggestions.length > 0 && (
        <ul role="listbox" className={s.dropdown}>
          {suggestions.map((el, i) => (
            <li
              key={el}
              role="option"
              aria-selected={i === activeIndex}
              className={s.item}
              onMouseDown={() => submit(el)}>
              {highlightMatch(el, value)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
