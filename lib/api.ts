import { toast } from "sonner";
import process from "process";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
};
//const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API
const baseUrl = "";
async function getCookieHeader(): Promise<string | undefined> {
  // Only relevant on the server — the browser sends cookies automatically
  if (typeof window !== "undefined") return undefined;

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const isAbsolute = /^https?:\/\//i.test(path);

  const base = isAbsolute
    ? undefined
    : baseUrl ||
      (typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL);

  const url = base ? new URL(path, base) : new URL(path);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", headers, body, params, cache = "no-store" } = options;

  try {
    const cookie = await getCookieHeader();
    const res = await fetch(buildUrl(path, params), {
      method,
      credentials: "include",
      cache,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const message = await res
        .json()
        .then((data) => data.message)
        .catch(() => res.statusText);

      if (typeof window !== "undefined") {
        toast.error(message);
      }

      throw new Error(message);
    }

    return res.status === 204 ? (undefined as T) : res.json();
  } catch (error) {
    console.error(`[api] ${method} ${path} failed:`, error);
    throw error;
  }
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "POST", body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "DELETE" }),
};
