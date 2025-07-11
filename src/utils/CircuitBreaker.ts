export class CircuitBreaker {
    private failures = 0;
    private threshold = 3;
    private open = false;
    private resetTimeout = 10000; // 10s
    private lastFailure = 0;

    canAttempt(): boolean {
        if (!this.open) return true;
        if (Date.now() - this.lastFailure > this.resetTimeout) {
            this.open = false;
            this.failures = 0;
            return true;
        }
        return false;
    }

    success(): void {
        this.failures = 0;
        this.open = false;
    }

    failure(): void {
        this.failures++;
        this.lastFailure = Date.now();
        if (this.failures >= this.threshold) {
            this.open = true;
        }
    }
}
