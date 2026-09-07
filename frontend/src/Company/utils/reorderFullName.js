export function reorderFullName(fullName) {
  if (!fullName || typeof fullName !== 'string') return fullName;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  const [first, ...rest] = parts;
  const last = rest.pop();
  return rest.length ? `${last} ${first} ${rest.join(' ')}` : `${last} ${first}`;
}
