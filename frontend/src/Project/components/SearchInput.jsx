import { useState, useRef } from 'react';
import { ALLWORDS } from '../const';

const allSuggestions = Object.values(ALLWORDS).flat();

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
    <div onClick={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите город или адрес"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => submit(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
