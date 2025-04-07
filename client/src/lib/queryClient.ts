import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get the API URL from environment variables or use a default
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Build a full URL for API requests, adding the base URL if needed
 * @param url The API endpoint path
 * @returns Full URL with API base if needed
 */
function buildApiUrl(url: string): string {
  // If the URL is already absolute, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If API_BASE_URL is set and the URL starts with /api, use the base URL
  if (API_BASE_URL && url.startsWith('/api')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // Otherwise, use the URL as is (for local development)
  return url;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = buildApiUrl(url);
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const urlKey = queryKey[0] as string;
    const fullUrl = buildApiUrl(urlKey);
    
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
