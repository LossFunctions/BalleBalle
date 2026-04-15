"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  formatDateInputValue,
  formatLongDateValue,
  isValidDateInputValue,
  parseDateInputValue,
} from "@/lib/dhol-checkout";

type DatePillInputProps = {
  invalid?: boolean;
  label: string;
  min?: string;
  name?: string;
  onChange: (value: string) => void;
  rangeStart?: string;
  required?: boolean;
  value: string;
};

type CalendarDay = {
  dateValue: string;
  dayNumber: number;
  disabled: boolean;
  isCurrentMonth: boolean;
  isInRange: boolean;
  isRangeEnd: boolean;
  isRangeStart: boolean;
  isSelected: boolean;
  isToday: boolean;
};

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getMonthStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, monthOffset: number) =>
  new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);

const getMonthEnd = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const compareDateValues = (firstDate: string, secondDate: string) =>
  firstDate.localeCompare(secondDate);

const getReferenceMonth = (value?: string, min?: string) => {
  if (value && isValidDateInputValue(value)) {
    return getMonthStart(parseDateInputValue(value));
  }

  if (min && isValidDateInputValue(min)) {
    return getMonthStart(parseDateInputValue(min));
  }

  return getMonthStart(new Date());
};

const getCalendarDays = ({
  min,
  rangeEnd,
  rangeStart,
  selectedValue,
  todayValue,
  visibleMonth,
}: {
  min?: string;
  rangeEnd?: string;
  rangeStart?: string;
  selectedValue?: string;
  todayValue: string;
  visibleMonth: Date;
}): CalendarDay[] => {
  const monthStart = getMonthStart(visibleMonth);
  const monthEnd = getMonthEnd(visibleMonth);
  const firstVisibleDate = new Date(monthStart);
  firstVisibleDate.setDate(monthStart.getDate() - monthStart.getDay());

  const lastVisibleDate = new Date(monthEnd);
  lastVisibleDate.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

  const days: CalendarDay[] = [];
  const hasRange =
    Boolean(rangeStart) &&
    Boolean(rangeEnd) &&
    isValidDateInputValue(rangeStart ?? "") &&
    isValidDateInputValue(rangeEnd ?? "") &&
    compareDateValues(rangeStart ?? "", rangeEnd ?? "") <= 0;

  for (
    const cursor = new Date(firstVisibleDate);
    cursor <= lastVisibleDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const dateValue = formatDateInputValue(cursor);

    days.push({
      dateValue,
      dayNumber: cursor.getDate(),
      disabled: Boolean(min && compareDateValues(dateValue, min) < 0),
      isCurrentMonth: cursor.getMonth() === visibleMonth.getMonth(),
      isInRange: Boolean(
        hasRange &&
          compareDateValues(dateValue, rangeStart ?? "") >= 0 &&
          compareDateValues(dateValue, rangeEnd ?? "") <= 0,
      ),
      isRangeEnd: Boolean(hasRange && dateValue === rangeEnd),
      isRangeStart: Boolean(hasRange && dateValue === rangeStart),
      isSelected: selectedValue === dateValue,
      isToday: todayValue === dateValue,
    });
  }

  return days;
};

export function DatePillInput({
  invalid = false,
  label,
  min,
  name,
  onChange,
  rangeStart,
  value,
}: DatePillInputProps) {
  const calendarId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const todayValue = useMemo(() => formatDateInputValue(new Date()), []);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getReferenceMonth(value, min),
  );

  useEffect(() => {
    setVisibleMonth(getReferenceMonth(value, min));
  }, [value, min]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const calendarDays = useMemo(
    () =>
      getCalendarDays({
        min,
        rangeEnd: value,
        rangeStart,
        selectedValue: value,
        todayValue,
        visibleMonth,
      }),
    [min, rangeStart, todayValue, value, visibleMonth],
  );

  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);
  const canViewPreviousMonth = useMemo(() => {
    if (!min || !isValidDateInputValue(min)) {
      return true;
    }

    const previousMonthEnd = getMonthEnd(previousMonth);

    return compareDateValues(formatDateInputValue(previousMonthEnd), min) >= 0;
  }, [min, previousMonth]);

  const toggleCalendar = () => {
    setIsOpen((currentValue) => !currentValue);
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const selectDate = (dateValue: string) => {
    onChange(dateValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="relative block text-sm text-ink/78" ref={rootRef}>
      <span className="block">{label}</span>
      <button
        aria-controls={calendarId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`relative mt-2 flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-paper px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 ${
          invalid
            ? "border-rose-300 bg-rose-50/70 text-rose-700 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
            : "border-ink/10 text-indigo hover:border-indigo/18 focus-visible:border-indigo focus-visible:ring-indigo/20"
        }`}
        onClick={toggleCalendar}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        <span className="text-sm font-medium">
          {value ? formatLongDateValue(value) : "Select date"}
        </span>
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
            isOpen
              ? "border-indigo/18 bg-indigo text-paper shadow-[0_16px_34px_-20px_rgba(34,30,71,0.55)]"
              : "border-ink/10 bg-cream text-ink/72"
          }`}
        >
          <svg
            aria-hidden="true"
            className={`h-4.5 w-4.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 3.75V6.25M17 3.75V6.25M4.75 8.5H19.25M6.5 5.5H17.5A1.75 1.75 0 0 1 19.25 7.25V18A1.75 1.75 0 0 1 17.5 19.75H6.5A1.75 1.75 0 0 1 4.75 18V7.25A1.75 1.75 0 0 1 6.5 5.5Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </span>
      </button>

      {name ? <input name={name} type="hidden" value={value} /> : null}

      {isOpen ? (
        <div
          aria-label={`${label} calendar`}
          className="flow-enter absolute left-1/2 top-[calc(100%+0.6rem)] z-40 w-[min(18.75rem,calc(100vw-1rem))] -translate-x-1/2 overflow-hidden rounded-[1.65rem] border border-indigo/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.985),rgba(249,248,244,0.98))] p-3 shadow-[0_32px_72px_-42px_rgba(34,30,71,0.52)] backdrop-blur"
          id={calendarId}
          role="dialog"
        >
          <div className="rounded-[1.3rem] border border-ink/6 bg-paper/82 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <button
                aria-label="Previous month"
                className="pressable inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-paper text-indigo transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-35"
                disabled={!canViewPreviousMonth}
                onClick={() => {
                  if (!canViewPreviousMonth) {
                    return;
                  }

                  setVisibleMonth(previousMonth);
                }}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14.75 6.75L9.5 12L14.75 17.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
              <div className="min-w-0 text-center">
                <p className="text-[1.05rem] font-semibold text-indigo">
                  {MONTH_LABEL_FORMATTER.format(visibleMonth)}
                </p>
              </div>
              <button
                aria-label="Next month"
                className="pressable inline-flex h-9 w-9 items-center justify-center rounded-full border border-indigo/12 bg-white text-indigo shadow-[0_18px_40px_-24px_rgba(34,30,71,0.34)] transition hover:-translate-y-0.5 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                onClick={() => {
                  setVisibleMonth(nextMonth);
                }}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9.25 6.75L14.5 12L9.25 17.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-y-2.5 text-center">
              {WEEKDAY_LABELS.map((weekdayLabel) => (
                <div
                  className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-indigo/38"
                  key={weekdayLabel}
                >
                  {weekdayLabel}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const isRangeEndpoint = day.isRangeStart || day.isRangeEnd;
                const isSingleDayRange = day.isRangeStart && day.isRangeEnd;
                const showRangeTrack = day.isInRange && !isSingleDayRange;
                const isWeekStart = index % 7 === 0;
                const isWeekEnd = index % 7 === 6;
                const extendsLeft = showRangeTrack && !day.isRangeStart;
                const extendsRight = showRangeTrack && !day.isRangeEnd;

                return (
                  <div
                    className="relative flex h-9 items-center justify-center"
                    key={day.dateValue}
                  >
                    {extendsLeft ? (
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute top-1/2 left-0 right-1/2 z-0 h-6 -translate-y-1/2 bg-indigo/14 ${
                          isWeekStart ? "rounded-l-full" : ""
                        }`}
                      />
                    ) : null}
                    {extendsRight ? (
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute top-1/2 left-1/2 right-0 z-0 h-6 -translate-y-1/2 bg-indigo/14 ${
                          isWeekEnd ? "rounded-r-full" : ""
                        }`}
                      />
                    ) : null}
                    <button
                      aria-pressed={day.isSelected}
                      className={`pressable relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[0.95rem] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                        day.isSelected || isRangeEndpoint
                          ? "bg-indigo text-paper shadow-[0_18px_36px_-24px_rgba(34,30,71,0.48)]"
                          : day.disabled
                            ? "cursor-not-allowed text-ink/24"
                            : day.isInRange
                              ? "text-indigo/82"
                              : day.isCurrentMonth
                                ? "text-indigo hover:bg-indigo/7"
                                : "text-indigo/36 hover:bg-cream"
                      } ${
                        day.isToday && !day.isSelected && !isRangeEndpoint
                          ? "ring-1 ring-indigo/18"
                          : ""
                      }`}
                      disabled={day.disabled}
                      onClick={() => {
                        selectDate(day.dateValue);
                      }}
                      type="button"
                    >
                      {day.dayNumber}
                    </button>
                  </div>
                );
              })}
            </div>

            {value ? (
              <p className="mt-3 border-t border-ink/8 pt-3 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-indigo/40">
                {rangeStart &&
                isValidDateInputValue(rangeStart) &&
                compareDateValues(rangeStart, value) <= 0
                  ? `${formatLongDateValue(rangeStart)} to ${formatLongDateValue(value)}`
                  : `Selected ${formatLongDateValue(value)}`}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
