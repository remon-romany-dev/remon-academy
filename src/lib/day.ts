export function cairoDay(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" }).format(date);
}

export function cairoDayRange(date = new Date()): { start: Date; end: Date } {
  const day = cairoDay(date);
  return {
    start: new Date(`${day}T00:00:00+02:00`),
    end: new Date(`${day}T23:59:59.999+02:00`),
  };
}
