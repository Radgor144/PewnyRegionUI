const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

interface RequestOptions extends RequestInit {}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        throw new ApiError(`Request failed (${res.status})`, res.status);
    }
    return res.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(path: string, options?: RequestOptions): Promise<T> => request<T>(path, options),
    post: <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),
};