export class StatusTracker {
    private statuses: Map<string, string> = new Map();

    setStatus(key: string, status: string): void {
        this.statuses.set(key, status);
    }

    getStatus(key: string): string | undefined {
        return this.statuses.get(key);
    }
}
