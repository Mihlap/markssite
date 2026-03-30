const SIZES = { normal: 40, small: 24 };
const COLOR = { blue: 'var(--blue-75BBFD)', orange: 'var(--salmon-FF7F6A)' };

const IconDefault = ({ name, size = 'normal', color = 'var(--white-F6F6F6)' }) => {
  const px = SIZES[size] ?? 40;
  const colorSvg = COLOR[color] ?? color;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={px} height={px} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0ZM19 9V19H9V21H19V31H21V21H31V19H21V9H19Z"
        fill={colorSvg}
      />
    </svg>
  );
};

export default IconDefault;
