import { EmailRequest, EmailService } from './EmailService';

export class Queue {
    private queue: EmailRequest[] = [];
    private processing = false;
    private service: EmailService;

    constructor(service: EmailService) {
        this.service = service;
    }

    enqueue(request: EmailRequest): void {
        this.queue.push(request);
        this.process();
    }

    private async process(): Promise<void> {
        if (this.processing) return;
        this.processing = true;
        while (this.queue.length > 0) {
            const req = this.queue.shift();
            if (req) await this.service.sendEmail(req);
        }
        this.processing = false;
    }
}
