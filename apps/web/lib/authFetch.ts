import { getSession } from './session';

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

  const response = await fetch(url, options);

  return response;
};
