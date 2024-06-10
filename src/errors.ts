export class RateLimitExceededError extends Error {
    constructor(message: string = 'Rate limit exceeded') {
        super(message);
        this.name = 'RateLimitExceededError';
    }
}

export class HttpClientError extends Error {
    constructor(code: number, message: string) {
        super(`Client error (${code}): ${message}`);
        this.name = 'HttpClientError';
    }
}

export class HttpServerError extends Error {
    constructor(code: number, message: string) {
        super(`Server error (${code}): ${message}`);
        this.name = 'HttpServerError';
    }
}
