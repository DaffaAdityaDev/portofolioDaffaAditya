import React from 'react';
import { formatDate } from '@/utils/date';

interface DateComponentProps {
  dateString?: string;
  className?: string;
}

export default function DateComponent({ dateString, className }: DateComponentProps) {
  if (!dateString) return null;

  const formatted = formatDate(dateString);

  return (
    <time dateTime={dateString} className={className}>
      {formatted}
    </time>
  );
}

export { DateComponent as Date };
