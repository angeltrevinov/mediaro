type ApiErrorBody = {
    error?: string;
    message?: string;
};

async function parseApiError(response: Response): Promise<string> {
    try {
        const body = (await response.json()) as ApiErrorBody;
        return body.error ?? body.message ?? `Request failed (${response.status})`;
    } catch {
        return `Request failed (${response.status})`;
    }
}

export async function requestJson<T>(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(input, init);

    if (!response.ok) {
        throw new Error(await parseApiError(response));
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

export async function requestNoContent(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<void> {
    const response = await fetch(input, init);

    if (!response.ok) {
        throw new Error(await parseApiError(response));
    }
}
