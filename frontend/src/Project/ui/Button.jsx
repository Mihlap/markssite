import s from '../styles/Button.module.css';

export default function Button({ label, isActive, disabled, onClick, className, icon, variant }) {
  return (
    <>
      <button
        className={`${s.button} ${variant ? s[variant] : ''} ${isActive ? s.active : ''} ${className ?? ''}`}
        onClick={onClick}
        disabled={disabled}>
        {icon}
        <p className={s.buttonLabel}>{label}</p>
      </button>
    </>
  );
}
