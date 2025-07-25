import fs from 'fs/promises';
import path from 'path';


class TemplateRenderer {
    constructor(templateDir) {
        this.templateDir = templateDir;
    }

    async loadTemplate(templateName) {
        try {
            const filePath = path.join(this.templateDir, templateName);
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch (error) {
            throw new Error(`Failed to load template ${templateName}: ${error.message}`);
        }
    }


    async renderHtmlTemplate(templateName, variables = {}) {
        const template = await this.loadTemplate(templateName);
        return Object.entries(variables).reduce(
            (content, [key, value]) => content.replace(`{${key}}`, value),
            template
        );
    }


    async renderUuidTemplate(templateName, variables = {}) {
        const template = await this.loadTemplate(templateName);
        const config = JSON.parse(template);
        return {
            ...config,
            template_variables: {
                ...config.template_variables,
                ...variables,
            },
        };
    }
}

export default TemplateRenderer;