/** Cliente HTTP para componentes de cliente. Lanza `ApiError` con el mensaje del backend. */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public issues?: { path: (string | number)[]; message: string }[],
  ) {
    super(message);
  }
}

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(path, {
    method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
    headers: init.body !== undefined ? { "content-type": "application/json" } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error;
    const issue = err?.issues?.[0];
    const msg = issue ? `${err.message}: ${issue.path?.join(".")} ${issue.message}` : err?.message ?? "Error inesperado";
    throw new ApiError(res.status, err?.code ?? "UNKNOWN", msg, err?.issues);
  }
  return data as T;
}
