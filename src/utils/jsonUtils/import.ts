import fs from 'fs';
import path from 'path';


export function parseVueFile(filePath: string) {
    const fullPath = path.resolve(filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');

    const templateMatch = fileContent.match(/<template[^>]*>([\s\S]*?)<\/template>/);
    const scriptMatch = fileContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const styleMatch = fileContent.match(/<style[^>]*>([\s\S]*?)<\/style>/);

    const templateContent = templateMatch ? templateMatch[1].trim() : '';
    const scriptContent = scriptMatch ? scriptMatch[1].trim() : '';
    const styleContent = styleMatch ? styleMatch[1].trim() : '';

    const result = {
        template: templateContent,
        script: scriptContent,
        style: styleContent
    };

    return result;
}

