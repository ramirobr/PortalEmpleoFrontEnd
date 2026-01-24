type Options = Omit<RequestInit, "body"> & {
  body?: Record<string, any>;
  internal?: boolean;
  token?: string;
};

export async function fetchApi<T = Response>(
  url: string,
  options: Options = {},
): Promise<T | null> {
  try {
    const { body, internal, token, ...rest } = options;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers ?? {}),
    };

    const finalOptions: RequestInit = {
      ...rest,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const origin = internal ? "" : process.env.NEXT_PUBLIC_API;
    const res = await fetch(origin + url, finalOptions);

    return (await res.json()) as T;
  } catch (error) {
    if (error === "aborted") return null;
    console.error("fetchApi Error:", url, error);
    return null;
  }
}
