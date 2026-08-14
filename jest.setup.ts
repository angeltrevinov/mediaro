import '@testing-library/jest-dom';

if (typeof globalThis.Response === 'undefined') {
  class MockResponse {
    body: string;
    status: number;
    statusText: string;
    headers: Headers;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.body = typeof body === 'string' ? body : body ? String(body) : '';
      this.status = init?.status ?? 200;
      this.statusText = init?.statusText ?? 'OK';
      this.headers = new Headers(init?.headers);
    }

    async json() {
      return JSON.parse(this.body || '{}');
    }

    async text() {
      return this.body;
    }
  }

  // @ts-expect-error - test shim for server-style route handlers in jsdom
  globalThis.Response = MockResponse;
}
