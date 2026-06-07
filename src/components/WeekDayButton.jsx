import { parseDateKey } from '../todoUtils';

export default function WeekDayButton({ dateKey, label, isSelected, isToday, count, onSelect }) {
  const dateObj = parseDateKey(dateKey);

  return (
    <button
      type="button"
      className={`week-day ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
      onClick={() => onSelect(dateKey)}
      aria-pressed={isSelected}
    >
      <span className="week-day-label">{label}</span>
      <span className="week-day-number">{dateObj.getDate()}</span>
      <span className="week-day-count">{count}개</span>
    </button>
  );
}
