"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor() {
        this.failures = 0;
        this.threshold = 3;
        this.open = false;
        this.resetTimeout = 10000; // 10s
        this.lastFailure = 0;
    }
    canAttempt() {
        if (!this.open)
            return true;
        if (Date.now() - this.lastFailure > this.resetTimeout) {
            this.open = false;
            this.failures = 0;
            return true;
        }
        return false;
    }
    success() {
        this.failures = 0;
        this.open = false;
    }
    failure() {
        this.failures++;
        this.lastFailure = Date.now();
        if (this.failures >= this.threshold) {
            this.open = true;
        }
    }
}
exports.CircuitBreaker = CircuitBreaker;
