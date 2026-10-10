export class FetchError extends Error {
  constructor(public status: number) {
    super(`Request failed with ${status}`);
  }
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new FetchError(res.status);
  return res.json();
}
