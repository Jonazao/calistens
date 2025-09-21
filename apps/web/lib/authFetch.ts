import { refreshToken } from './auth';
import { getSession, updateTokens } from './session';

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  const session = await getSession();

  options.headers = {
    ...options.headers,
    authorization: `Bearer ${session?.accessToken}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    if (!session?.refreshToken) throw new Error('refresh token not found!');

    // TODO:JGuerrero: refactor to do not use the body of the request to get a new token and use the header instead
    const refreshResponse = await refreshToken(session.refreshToken);
    const newAccessToken = refreshResponse?.accessToken;
    const newRefreshToken = refreshResponse?.refreshToken;
    await fetch('http://localhost:3000/api/auth/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
      credentials: 'include', // ✅ send and receive cookies
    });
    if (newAccessToken) {
      options.headers.authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, options);
    }
  }
  return response;
};
