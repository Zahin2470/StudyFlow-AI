// Thin fetch wrapper for client components — throws a readable message on
// failure so forms can show it directly instead of a generic "error".
export async function apiRequest<T>(
  url: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(url, {
    method: options?.method ?? "GET",
    headers: options?.body ? { "Content-Type": "application/json" } : undefined,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Something went wrong.");
  }
  return json as T;
}
