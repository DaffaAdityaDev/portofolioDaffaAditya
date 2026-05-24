import { parseISO, format } from 'date-fns';

export default function Date({ dateString }: any) {
  if (!dateString) return null;
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      return <time dateTime={dateString}>{dateString}</time>;
    }
    return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
  } catch (error) {
    return <time dateTime={dateString}>{dateString}</time>;
  }
}
