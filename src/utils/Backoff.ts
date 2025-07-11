export class Backoff {
    async wait(attempt: number): Promise<void> {
        const delay = Math.pow(2, attempt) * 100; // Exponential backoff: 100ms, 200ms, 400ms...
        return new Promise(res => setTimeout(res, delay));
    }
}
