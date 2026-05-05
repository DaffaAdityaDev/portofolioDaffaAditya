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
