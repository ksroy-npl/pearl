export class IdempotencyStore {
    private store: Set<string> = new Set();

    exists(key: string): boolean {
        return this.store.has(key);
    }

    save(key: string): void {
        this.store.add(key);
    }
}
