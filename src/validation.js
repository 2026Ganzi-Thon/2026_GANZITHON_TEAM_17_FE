export function validBirthDate(value, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return year >= 1900 && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date <= today;
}
export function validPhone(value) {
  return /^(010\d{8}|010-\d{4}-\d{4})$/.test(value);
}
