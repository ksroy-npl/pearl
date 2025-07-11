"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    constructor(service) {
        this.queue = [];
        this.processing = false;
        this.service = service;
    }
    enqueue(request) {
        this.queue.push(request);
        this.process();
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.processing)
                return;
            this.processing = true;
            while (this.queue.length > 0) {
                const req = this.queue.shift();
                if (req)
                    yield this.service.sendEmail(req);
            }
            this.processing = false;
        });
    }
}
exports.Queue = Queue;
