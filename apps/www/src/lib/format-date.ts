const PUBLISHED_ON = /^(\d{2})-(\d{2})-(\d{4})$/;

export function toIsoDate(value: string): string | undefined {
  const match = PUBLISHED_ON.exec(value);
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function publishedOnTime(value: string): number {
  const iso = toIsoDate(value);
  return iso ? new Date(`${iso}T00:00:00`).getTime() : Number.NaN;
}

export function formatDate(date: string, includeRelative = false) {
  const iso = toIsoDate(date);
  if (!iso) return '';

  const [year, month, day] = iso.split('-');
  const fullDate = `${day}/${month}/${year.slice(-2)}`;

  if (!includeRelative) {
    return fullDate;
  }

  return fullDate;
}
