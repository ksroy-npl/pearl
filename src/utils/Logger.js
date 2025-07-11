"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    info(msg) {
        console.log(`[INFO] ${msg}`);
    }
    error(msg) {
        console.error(`[ERROR] ${msg}`);
    }
}
exports.Logger = Logger;
