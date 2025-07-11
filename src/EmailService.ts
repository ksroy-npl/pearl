import { EmailProvider } from './providers/EmailProvider';
import { MockProvider1 } from './providers/MockProvider1';
import { MockProvider2 } from './providers/MockProvider2';
import { Backoff } from './utils/Backoff';
import { RateLimiter } from './utils/RateLimiter';
import { IdempotencyStore } from './utils/IdempotencyStore';
import { StatusTracker } from './utils/StatusTracker';
import { Logger } from './utils/Logger';
import { CircuitBreaker } from './utils/CircuitBreaker';

export interface EmailRequest {
    to: string;
    subject: string;
    body: string;
    idempotencyKey: string;
}

export class EmailService {
    private providers: EmailProvider[];
    private backoff: Backoff;
    private rateLimiter: RateLimiter;
    private idempotencyStore: IdempotencyStore;
    private statusTracker: StatusTracker;
    private logger: Logger;
    private circuitBreakers: CircuitBreaker[];

    constructor() {
        this.providers = [new MockProvider1(), new MockProvider2()];
        this.backoff = new Backoff();
        this.rateLimiter = new RateLimiter(5, 10000); // 5 emails per 10s
        this.idempotencyStore = new IdempotencyStore();
        this.statusTracker = new StatusTracker();
        this.logger = new Logger();
        this.circuitBreakers = this.providers.map(() => new CircuitBreaker());
    }

    async sendEmail(request: EmailRequest): Promise<boolean> {
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
                    await this.backoff.wait(attempt);
                    await provider.send(request);
                    this.idempotencyStore.save(request.idempotencyKey);
                    this.statusTracker.setStatus(request.idempotencyKey, 'sent');
                    this.logger.info(`Email sent via ${provider.name}`);
                    cb.success();
                    return true;
                } catch (err) {
                    this.logger.error(`Attempt ${attempt + 1} failed on ${provider.name}: ${err}`);
                    cb.failure();
                    attempt++;
                }
            }
        }

        this.statusTracker.setStatus(request.idempotencyKey, 'failed');
        this.logger.error('All providers failed.');
        return false;
    }

    getStatus(idempotencyKey: string): string | undefined {
        return this.statusTracker.getStatus(idempotencyKey);
    }
}
