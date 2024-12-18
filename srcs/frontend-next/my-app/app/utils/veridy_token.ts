export function setSessionAccessToken(token: string): void {
  sessionStorage.setItem("access_token", token);
}

export function setSessionRefreshToken(token: string): void {
  sessionStorage.setItem("refresh_token", token);
}

export function getSessionAccessToken(): string {
  const token = sessionStorage.getItem("access_token") ?? "";
  return token;
}

export function getSessionRefreshToken(): string {
  const token = sessionStorage.getItem("refresh_token") ?? "";
  return token;
}

export function removeSessionAccessToken(): void {
  sessionStorage.removeItem("access_token");
}

export function removeSessionRefreshToken(): void {
  sessionStorage.removeItem("refresh_token");
}

// すべてのtokenを削除
export function clearSessionTokens(): void {
  sessionStorage.clear();
}
