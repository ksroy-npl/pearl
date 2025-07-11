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
exports.EmailService = void 0;
const MockProvider1_1 = require("./providers/MockProvider1");
const MockProvider2_1 = require("./providers/MockProvider2");
const Backoff_1 = require("./utils/Backoff");
const RateLimiter_1 = require("./utils/RateLimiter");
const IdempotencyStore_1 = require("./utils/IdempotencyStore");
const StatusTracker_1 = require("./utils/StatusTracker");
const Logger_1 = require("./utils/Logger");
const CircuitBreaker_1 = require("./utils/CircuitBreaker");
class EmailService {
    constructor() {
        this.providers = [new MockProvider1_1.MockProvider1(), new MockProvider2_1.MockProvider2()];
        this.backoff = new Backoff_1.Backoff();
        this.rateLimiter = new RateLimiter_1.RateLimiter(5, 10000); // 5 emails per 10s
        this.idempotencyStore = new IdempotencyStore_1.IdempotencyStore();
        this.statusTracker = new StatusTracker_1.StatusTracker();
        this.logger = new Logger_1.Logger();
        this.circuitBreakers = this.providers.map(() => new CircuitBreaker_1.CircuitBreaker());
    }
    sendEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.idempotencyStore.exists(request.idempotencyKey)) {
                this.logger.info('Duplicate request detected.');
                return false;
            }
            if (!this.rateLimiter.allow()) {
                this.logger.error('Rate limit exceeded.');
                this.statusTracker.setStatus(request.idempotencyKey, 'rate_limited');
                return false;
            }
            for (let i = 0; i < this.providers.length; i++) {
                const provider = this.providers[i];
                const cb = this.circuitBreakers[i];
                if (!cb.canAttempt()) {
                    this.logger.error(`Provider ${provider.name} is in circuit breaker open state.`);
                    continue;
                }
                let attempt = 0;
                while (attempt < 3) {
                    try {
                        yield this.backoff.wait(attempt);
                        yield provider.send(request);
                        this.idempotencyStore.save(request.idempotencyKey);
                        this.statusTracker.setStatus(request.idempotencyKey, 'sent');
                        this.logger.info(`Email sent via ${provider.name}`);
                        cb.success();
                        return true;
                    }
                    catch (err) {
                        this.logger.error(`Attempt ${attempt + 1} failed on ${provider.name}: ${err}`);
                        cb.failure();
                        attempt++;
                    }
                }
            }
            this.statusTracker.setStatus(request.idempotencyKey, 'failed');
            this.logger.error('All providers failed.');
            return false;
        });
    }
    getStatus(idempotencyKey) {
        return this.statusTracker.getStatus(idempotencyKey);
    }
}
exports.EmailService = EmailService;
