"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTracker = void 0;
class StatusTracker {
    constructor() {
        this.statuses = new Map();
    }
    setStatus(key, status) {
        this.statuses.set(key, status);
    }
    getStatus(key) {
        return this.statuses.get(key);
    }
}
exports.StatusTracker = StatusTracker;
