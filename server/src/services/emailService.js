import logger from '../utils/logger.js';
import { validateEmail } from '../utils/validator.js';
import dotenv from 'dotenv';
import TemplateRenderer from '../utils/templateRenderer.js';

dotenv.config();

const EMAIL_TYPES = {
    VERIFICATION: {
        subject: 'Verify your email',
        category: 'Email Verification',
        template: 'verificationEmail.html',
        templateVariable: 'verificationCode',
    },
    WELCOME: {
        template: 'welcomeEmail.json',
        templateVariable: 'name',
    },
    PASSWORD_RESET: {
        subject: 'Reset your password',
        category: 'Password Reset',
        template: 'passwordResetEmail.html',
        templateVariable: 'resetURL',
    },
    PASSWORD_RESET_SUCCESS: {
        subject: 'Password Reset Successful',
        category: 'Password Reset',
        template: 'resetSuccessEmail.html',
    },
};

class EmailService {
    constructor(client, sender, templateDir) {
        this.client = client;
        this.sender = sender;
        this.templateRenderer = new TemplateRenderer(templateDir);
    }

    async #sendEmail({ to, subject, html, category, template_uuid, template_variables }) {
        const recipient = [{ email: to }];
        const emailOptions = {
            from: this.sender,
            to: recipient,
            ...(subject && { subject }),
            ...(html && { html }),
            ...(category && { category }),
            ...(template_uuid && { template_uuid }),
            ...(template_variables && { template_variables }),
        };

        try {
            const response = await this.client.send(emailOptions);
            logger.info(`Email sent to ${to}: ${response.message}`);
            return response;
        } catch (error) {
            logger.error(`Error sending email to ${to}: ${error.message}`);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async sendVerificationEmail(email, verificationToken) {
        if (!validateEmail(email)) {
            throw new Error('Invalid email address');
        }

        const { subject, category, template, templateVariable } = EMAIL_TYPES.VERIFICATION;
        const html = await this.templateRenderer.renderHtmlTemplate(template, {
            [templateVariable]: verificationToken,
        });
        return this.#sendEmail({ to: email, subject, html, category });
    }

    async sendWelcomeEmail(email, name) {
        if (!validateEmail(email)) {
            throw new Error('Invalid email address');
        }
        if (!name) throw new Error('Name is required');
        const { template, templateVariable } = EMAIL_TYPES.WELCOME;
        const { template_uuid, template_variables } = await this.templateRenderer.renderUuidTemplate(template, {
            [templateVariable]: name,
        });
        return this.#sendEmail({ to: email, template_uuid, template_variables });
    }

    async sendPasswordResetEmail(email, resetURL) {
        if (!validateEmail(email)) {
            throw new Error('Invalid email address');
        } if (!resetURL) throw new Error('Reset URL is required');
        const { subject, category, template, templateVariable } = EMAIL_TYPES.PASSWORD_RESET;
        const html = await this.templateRenderer.renderHtmlTemplate(template, {
            [templateVariable]: resetURL,
        });
        return this.#sendEmail({ to: email, subject, html, category });
    }

    async sendResetSuccessEmail(email) {
        if (!validateEmail(email)) {
            throw new Error('Invalid email address');
        }
        const { subject, category, template } = EMAIL_TYPES.PASSWORD_RESET_SUCCESS;
        const html = await this.templateRenderer.renderHtmlTemplate(template);
        return this.#sendEmail({ to: email, subject, html, category });
    }
}

export default EmailService;