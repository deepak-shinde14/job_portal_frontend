import Cookies from 'js-cookie';

const TOKEN_COOKIE = 'job_portal_auth_token';

export const setAuthCookie = (token: string) => {
  // Set cookie with secure attributes - expires in 7 days
  Cookies.set(TOKEN_COOKIE, token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAuthCookie = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE);
};

export const removeAuthCookie = () => {
  Cookies.remove(TOKEN_COOKIE);
};