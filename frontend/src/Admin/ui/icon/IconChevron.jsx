const IconChevron = ({ rotated = false, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    style={{ transform: rotated ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
    <path d="M3 6L8 11L13 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default IconChevron;
