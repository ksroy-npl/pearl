import { EmailService } from './EmailService';

const service = new EmailService();

service.sendEmail({
    to: 'your@example.com',
    subject: 'Demo',
    body: 'This is a demo email.',
    idempotencyKey: 'demo-key-1'
}).then(result => {
    console.log('Send result:', result);
    console.log('Status:', service.getStatus('demo-key-1'));
});
