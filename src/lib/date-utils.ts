// HTML <input type="date"> requires exactly "yyyy-MM-dd" — this normalizes
// a Date or ISO string (as returned from the API) into that shape so edit
// forms actually pre-fill instead of showing blank.
export function toDateInputValue(value: string | Date | undefined | null): string | undefined {
  if (!value) return undefined;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}
