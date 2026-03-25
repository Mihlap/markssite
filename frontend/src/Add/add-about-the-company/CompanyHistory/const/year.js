export const yearOptions = Array.from({ length: 51 }, (_, i) => {
  const year = (2001 + i).toString();
  return { value: year, label: year };
});
