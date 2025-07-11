"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(maxRequests, interval) {
        this.timestamps = [];
        this.maxRequests = maxRequests;
        this.interval = interval;
    }
    allow() {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(ts => now - ts < this.interval);
        if (this.timestamps.length < this.maxRequests) {
            this.timestamps.push(now);
            return true;
        }
        return false;
    }
}
exports.RateLimiter = RateLimiter;
