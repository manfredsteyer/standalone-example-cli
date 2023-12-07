export function addMinutes(dateStr: string, minutes: number) {
  const date = new Date(dateStr);
  date.setTime(date.getTime() + 1000 * 60 * minutes);
  return date.toISOString()
}
