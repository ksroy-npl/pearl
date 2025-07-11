import { EmailRequest } from '../EmailService';

export interface EmailProvider {
    name: string;
    send(request: EmailRequest): Promise<void>;
}
