import { EmailProvider } from './EmailProvider';
import { EmailRequest } from '../EmailService';

export class MockProvider1 implements EmailProvider {
    name = 'MockProvider1';

    async send(request: EmailRequest): Promise<void> {
        // Simulate random failure
        if (Math.random() < 0.7) {
            throw new Error('MockProvider1 failed to send email.');
        }
        // Simulate sending
        return;
    }
}
