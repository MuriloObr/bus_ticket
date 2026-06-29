const DATE_BR = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const DATE_TIME_BR = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
const DATE_TIME_ISO = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/;

export function toMySQLDate(value: string): string {
  const m = value.match(DATE_BR);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return value;
}

export function toMySQLDateTime(value: string): string {
  const m = value.match(DATE_TIME_BR);
  if (m) return `${m[3]}-${m[2]}-${m[1]} ${m[4]}:${m[5]}:00`;
  const m2 = value.match(DATE_TIME_ISO);
  if (m2) return `${m2[1]} ${m2[2]}`;
  return value;
}
