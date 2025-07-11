import { EmailService, EmailRequest } from '../src/EmailService';

describe('EmailService', () => {
    let service: EmailService;

    beforeEach(() => {
        service = new EmailService();
    });

    it('should send an email successfully', async () => {
        const req: EmailRequest = {
            to: 'test@example.com',
            subject: 'Test',
            body: 'Hello',
            idempotencyKey: 'unique-key-1'
        };
        const result = await service.sendEmail(req);
        expect(result).toBe(true);
        expect(service.getStatus(req.idempotencyKey)).toBe('sent');
    });

    it('should not send duplicate emails', async () => {
        const req: EmailRequest = {
            to: 'test@example.com',
            subject: 'Test',
            body: 'Hello',
            idempotencyKey: 'unique-key-2'
        };
        await service.sendEmail(req);
        const result = await service.sendEmail(req);
        expect(result).toBe(false);
    });

    it('should rate limit excessive requests', async () => {
        const reqs = Array.from({ length: 10 }, (_, i) => ({
            to: 'test@example.com',
            subject: 'Test',
            body: 'Hello',
            idempotencyKey: `unique-key-rate-${i}`
        }));
        let rateLimited = false;
        for (const req of reqs) {
            const result = await service.sendEmail(req);
            if (!result) rateLimited = true;
        }
        expect(rateLimited).toBe(true);
    });
});
