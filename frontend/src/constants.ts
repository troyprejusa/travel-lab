/** Values exposed to the browser must never contain secrets. */
export const config = {
  mode: import.meta.env.MODE,
  // Fake credentials are only available when Vite is running its dev server.
  useDevelopmentAuth: import.meta.env.DEV,
  apiBase: "/api/v1",
} as const;
