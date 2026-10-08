/**
 * Calculates the duration between a start date and the current time.
 * Returns the duration formatted as Years, Months, Days, Hours, Minutes, and Seconds.
 */
export const calculateDuration = (startDate: Date) => {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  const months = Math.floor(remainingDays / 30);
  const finalDays = remainingDays % 30;

  return {
    y: years.toString().padStart(2, '0'),
    m: months.toString().padStart(2, '0'),
    d: finalDays.toString().padStart(2, '0'),
    hh: (hours % 24).toString().padStart(2, '0'),
    mm: (minutes % 60).toString().padStart(2, '0'),
    ss: (seconds % 60).toString().padStart(2, '0')
  };
};

/**
 * Safely formats an ISO date string or Date object into a readable format.
 * Pure function with fallback handling for malformed dates.
 * Formatted in UTC, where "2025-05-12" is parsed, so the server and every
 * visitor's browser print the same day and hydration does not mismatch.
 */
export const formatDate = (
  dateInput: string | Date | undefined | null,
  locale: string = 'en-US'
): string => {
  if (!dateInput) return '';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      return typeof dateInput === 'string' ? dateInput : '';
    }
    return date.toLocaleDateString(locale, {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return typeof dateInput === 'string' ? dateInput : '';
  }
};

/**
 * Returns the current time formatted for the Asia/Jakarta timezone (24-hour clock).
 * Pure function with default parameter for effortless testing and rendering.
 */
export const formatJakartaTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
