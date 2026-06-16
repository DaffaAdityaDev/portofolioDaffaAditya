export default function DateComponent({ dateString }: any) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return <time dateTime={dateString}>{dateString}</time>;
    }
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return <time dateTime={dateString}>{formatted}</time>;
  } catch (error) {
    return <time dateTime={dateString}>{dateString}</time>;
  }
}
export { DateComponent as Date };
