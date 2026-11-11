// Where the login token (JWT) is kept between page loads.
//
// localStorage survives reloads and new tabs, so users stay logged in.
// Trade-off: any JavaScript running on the page can read it, so the app must
// not be open to XSS (React escapes rendered text by default, which helps).
// The main alternative is an httpOnly cookie, which JavaScript can't read but
// needs extra CSRF protection and cross-site cookie setup.
const TOKEN_KEY = 'jobconnect_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}
