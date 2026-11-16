import { auth } from "@/auth/auth";
import { config } from "@/constants";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = auth.getToken();
  if (!token) throw new Error("Please sign in to continue.");
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${config.apiBase}${path}`, { ...options, headers });
}
