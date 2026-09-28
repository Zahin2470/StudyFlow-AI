// HTML <input type="date"> requires exactly "yyyy-MM-dd" — this normalizes
// a Date or ISO string (as returned from the API) into that shape so edit
// forms actually pre-fill instead of showing blank.
export function toDateInputValue(value: string | Date | undefined | null): string | undefined {
  if (!value) return undefined;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

// Same idea as toDateInputValue but for <input type="datetime-local">, used
// by the Study Planner's session form.
export function toDateTimeInputValue(value: string | Date | undefined | null): string | undefined {
  if (!value) return undefined;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
