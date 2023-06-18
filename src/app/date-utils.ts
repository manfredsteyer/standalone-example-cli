export function addMinutes(dateAsStr: string, minutes: number): string {
  console.log('dateAsStr', dateAsStr)
  const date = new Date(dateAsStr);
  date.setTime(date.getTime() + minutes * 60 * 1000);
  return date.toISOString();
}
