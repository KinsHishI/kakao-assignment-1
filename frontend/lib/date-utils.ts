export function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysToDateKey(dateKey: string, diff: number) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + diff);
  return formatDateKey(date);
}

export function getWeekStartDateKey(date: Date) {
  const target = new Date(date);
  const day = target.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  target.setDate(target.getDate() + diff);
  return formatDateKey(target);
}

export function getWeekDates(startDateKey: string) {
  return Array.from({ length: 7 }, (_, index) => addDaysToDateKey(startDateKey, index));
}

export function formatWeekRange(startDateKey: string) {
  const endDateKey = addDaysToDateKey(startDateKey, 6);
  return `${startDateKey.replaceAll('-', '.')} - ${endDateKey.replaceAll('-', '.')}`;
}
