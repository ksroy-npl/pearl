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
const EmailService_1 = require("../src/EmailService");
describe('EmailService', () => {
    let service;
    beforeEach(() => {
        service = new EmailService_1.EmailService();
    });
    it('should send an email successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            to: 'test@example.com',
            subject: 'Test',
            body: 'Hello',
            idempotencyKey: 'unique-key-1'
        };
        const result = yield service.sendEmail(req);
        expect(result).toBe(true);
        expect(service.getStatus(req.idempotencyKey)).toBe('sent');
    }));
    it('should not send duplicate emails', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            to: 'test@example.com',
            subject: 'Test',
            body: 'Hello',
            idempotencyKey: 'unique-key-2'
        };
        yield service.sendEmail(req);
        const result = yield service.sendEmail(req);
        expect(result).toBe(false);
    }));
    it('should rate limit excessive requests', () => __awaiter(void 0, void 0, void 0, function* () {
        const reqs = Array.from({ length: 10 }, (_, i) => ({
            to: 'test@example.com',
            subject: 'Test',
            body: 'Hello',
            idempotencyKey: `unique-key-rate-${i}`
        }));
        let rateLimited = false;
        for (const req of reqs) {
            const result = yield service.sendEmail(req);
            if (!result)
                rateLimited = true;
        }
        expect(rateLimited).toBe(true);
    }));
});
