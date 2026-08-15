import { toast } from "sonner";
import { redirect } from "next/navigation";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
};
var baseClient: string | undefined;
if (typeof window === "undefined") {
  baseClient = process.env.BACKEND_API_URL;
} else {
  baseClient = "";
}

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

function getXsrfTokenFromCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const isAbsolute = /^https?:\/\//i.test(path);
  let url: URL;

  if (isAbsolute) {
    url = new URL(path);
  } else {
    const pathWithPrefix = path.startsWith("/") ? path : `/api/v1/${path}`;
    url = baseClient
      ? new URL(pathWithPrefix, baseClient)
      : new URL(pathWithPrefix, window.location.origin);
  }

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
    const xsrfToken = getXsrfTokenFromCookie();
    const res = await fetch(buildUrl(path, params), {
      method,
      credentials: "include",
      cache,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
        ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res
        .json()
        .then((data) => data)
        .catch(() => ({ message: res.statusText }));

      if (res.status === 401) {
        typeof window !== "undefined"
          ? (window.location.href = "/login")
          : redirect("/login");
        throw new ApiError(err.message, err?.errors);
      }
      if (typeof window !== "undefined") {
        toast.error(err.message);
      }

      throw new ApiError(err.message, err?.errors);
    }

    return res.status === 204
      ? (undefined as T)
      : res.json().then((data) => data.data);
  } catch (error) {
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

class ApiError extends Error {
  errors: unknown;

  constructor(message: string, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}
