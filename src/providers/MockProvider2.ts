import { EmailProvider } from './EmailProvider';
import { EmailRequest } from '../EmailService';

export class MockProvider2 implements EmailProvider {
    name = 'MockProvider2';

    async send(request: EmailRequest): Promise<void> {
        // Simulate random failure
        if (Math.random() < 0.5) {
            throw new Error('MockProvider2 failed to send email.');
        }
        // Simulate sending
        return;
    }
}
