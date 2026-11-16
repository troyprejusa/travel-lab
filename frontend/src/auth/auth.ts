import { config } from "@/constants";

export interface AuthService {
  readonly kind: "development" | "magic-link";
  getToken(): string | null;
  signOut(): void;
  signInDevelopment(): Promise<void>;
  requestMagicLink(email: string): Promise<void>;
}

const developmentIdentity = "troy@test.com";
const sessionKey = "travel-lab.dev-session";

class DevelopmentAuthService implements AuthService {
  readonly kind = "development" as const;

  getToken() {
    return sessionStorage.getItem(sessionKey) === "active"
      ? developmentIdentity
      : null;
  }
  signOut() {
    sessionStorage.removeItem(sessionKey);
  }
  async signInDevelopment() {
    const response = await fetch(
      `${config.apiBase}/user/${encodeURIComponent(developmentIdentity)}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${developmentIdentity}` },
      },
    );
    if (!response.ok)
      throw new Error(
        `Development sign-in failed (HTTP ${response.status}). Check that the backend is running in development mode.`,
      );
    sessionStorage.setItem(sessionKey, "active");
  }
  async requestMagicLink(): Promise<void> {
    throw new Error("Magic links are not used in development mode.");
  }
}

class MagicLinkAuthService implements AuthService {
  readonly kind = "magic-link" as const;
  getToken() {
    return null;
  }
  signOut() {}
  async signInDevelopment(): Promise<void> {
    throw new Error("Development sign-in is unavailable.");
  }
  async requestMagicLink(_email: string): Promise<void> {
    throw new Error("Magic link authentication is not connected yet.");
  }
}

export function createAuthService(): AuthService {
  return config.useDevelopmentAuth
    ? new DevelopmentAuthService()
    : new MagicLinkAuthService();
}

export const auth = createAuthService();
