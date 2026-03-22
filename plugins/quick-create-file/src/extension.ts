import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// 支持的编程语言配置
interface LanguageConfig {
    name: string;
    extensions: string[];
    icon?: string;
}

const SUPPORTED_LANGUAGES: LanguageConfig[] = [
    { name: 'HTML', extensions: ['.html', '.htm'], icon: '🌐' },
    { name: 'CSS', extensions: ['.css'], icon: '🎨' },
    { name: 'JavaScript', extensions: ['.js'], icon: '📜' },
    { name: 'TypeScript', extensions: ['.ts'], icon: '📘' },
    { name: 'React (JSX)', extensions: ['.jsx'], icon: '⚛️' },
    { name: 'React (TSX)', extensions: ['.tsx'], icon: '⚛️' },
    { name: 'Vue', extensions: ['.vue'], icon: '💚' },
    { name: 'PHP', extensions: ['.php'], icon: '🐘' },
    { name: 'Java', extensions: ['.java'], icon: '☕' },
    { name: 'C', extensions: ['.c'], icon: '🔧' },
    { name: 'C++', extensions: ['.cpp', '.cc', '.cxx'], icon: '⚙️' },
    { name: 'C#', extensions: ['.cs'], icon: '🎮' },
    { name: 'Python', extensions: ['.py'], icon: '🐍' },
    { name: 'Go', extensions: ['.go'], icon: '🐹' },
    { name: 'Rust', extensions: ['.rs'], icon: '🦀' },
    { name: 'Markdown', extensions: ['.md'], icon: '📝' },
    { name: 'JSON', extensions: ['.json'], icon: '📋' },
    { name: 'XML', extensions: ['.xml'], icon: '📄' },
    { name: 'SQL', extensions: ['.sql'], icon: '🗃️' },
    { name: 'Shell', extensions: ['.sh'], icon: '💻' },
    { name: 'YAML', extensions: ['.yml', '.yaml'], icon: '⚙️' },
    { name: 'Sass/SCSS', extensions: ['.scss', '.sass'], icon: '🎨' },
    { name: 'Less', extensions: ['.less'], icon: '🎨' },
    { name: 'Dart', extensions: ['.dart'], icon: '🎯' },
    { name: 'Kotlin', extensions: ['.kt'], icon: '📱' },
    { name: 'Swift', extensions: ['.swift'], icon: '🍎' },
    { name: 'Ruby', extensions: ['.rb'], icon: '💎' },
    { name: 'Lua', extensions: ['.lua'], icon: '🌙' },
    { name: 'R', extensions: ['.r'], icon: '📊' },
];

// 扩展名到语言的映射
const EXTENSION_TO_LANGUAGE: Map<string, string> = new Map([
    ['.html', 'HTML'], ['.htm', 'HTML'],
    ['.css', 'CSS'],
    ['.js', 'JavaScript'],
    ['.ts', 'TypeScript'],
    ['.jsx', 'React (JSX)'],
    ['.tsx', 'React (TSX)'],
    ['.vue', 'Vue'],
    ['.php', 'PHP'],
    ['.java', 'Java'],
    ['.c', 'C'],
    ['.cpp', 'C++'], ['.cc', 'C++'], ['.cxx', 'C++'],
    ['.cs', 'C#'],
    ['.py', 'Python'],
    ['.go', 'Go'],
    ['.rs', 'Rust'],
    ['.md', 'Markdown'],
    ['.json', 'JSON'],
    ['.xml', 'XML'],
    ['.sql', 'SQL'],
    ['.sh', 'Shell'],
    ['.yml', 'YAML'], ['.yaml', 'YAML'],
    ['.scss', 'Sass/SCSS'], ['.sass', 'Sass/SCSS'],
    ['.less', 'Less'],
    ['.dart', 'Dart'],
    ['.kt', 'Kotlin'],
    ['.swift', 'Swift'],
    ['.rb', 'Ruby'],
    ['.lua', 'Lua'],
    ['.r', 'R'],
]);

// 根据文件路径检测语言类型
function detectLanguage(filePath: string): string | undefined {
    const ext = path.extname(filePath).toLowerCase();
    return EXTENSION_TO_LANGUAGE.get(ext);
}

// 获取默认扩展名
function getDefaultExtension(language: string): string {
    const config = SUPPORTED_LANGUAGES.find(l => l.name === language);
    return config ? config.extensions[0] : '.txt';
}

// 获取目标目录
function getTargetDirectory(uri: vscode.Uri | undefined): string {
    if (uri) {
        const stat = fs.statSync(uri.fsPath);
        return stat.isDirectory() ? uri.fsPath : path.dirname(uri.fsPath);
    }
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
}

// 检查文件是否存在
function fileExists(filePath: string): boolean {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

// 创建文件并打开
async function createAndOpenFile(filePath: string, content: string = ''): Promise<void> {
    const dir = path.dirname(filePath);
    
    // 确保目录存在
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // 创建文件
    fs.writeFileSync(filePath, content, 'utf8');
    
    // 打开文件
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
    
    vscode.window.showInformationMessage(`已创建文件: ${path.basename(filePath)}`);
}

// 生成文件模板内容
function generateTemplateContent(fileName: string, extension: string): string {
    const baseName = path.basename(fileName, extension);
    
    switch (extension) {
        case '.html':
            return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${baseName}</title>
</head>
<body>
    
</body>
</html>`;
        
        case '.vue':
            return `<template>
    <div class="${baseName.toLowerCase()}">
        
    </div>
</template>

<script setup lang="ts">
    
</script>

<style scoped>
    
</style>`;
        
        case '.jsx':
            return `import React from 'react';

interface ${baseName}Props {
    
}

const ${baseName}: React.FC<${baseName}Props> = () => {
    return (
        <div className="${baseName.toLowerCase()}">
            
        </div>
    );
};

export default ${baseName};`;
        
        case '.tsx':
            return `import React from 'react';

interface ${baseName}Props {
    
}

const ${baseName}: React.FC<${baseName}Props> = () => {
    return (
        <div className="${baseName.toLowerCase()}">
            
        </div>
    );
};

export default ${baseName};`;
        
        case '.py':
            return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
${baseName}
"""

def main():
    pass

if __name__ == '__main__':
    main()
`;
        
        case '.java':
            const className = baseName.charAt(0).toUpperCase() + baseName.slice(1);
            return `public class ${className} {
    public static void main(String[] args) {
        
    }
}`;
        
        case '.go':
            return `package main

func main() {
    
}
`;
        
        case '.rs':
            return `fn main() {
    
}
`;
        
        case '.php':
            return `<?php
/**
 * ${baseName}
 */

`;
        
        case '.ts':
        case '.js':
            return `/**
 * ${baseName}
 */

`;
        
        default:
            return '';
    }
}

// 智能创建文件命令
async function createFile(uri: vscode.Uri | undefined) {
    const targetDir = getTargetDirectory(uri);
    
    // 检测当前上下文的语言
    let detectedLanguage: string | undefined;
    if (uri && !fs.statSync(uri.fsPath).isDirectory()) {
        detectedLanguage = detectLanguage(uri.fsPath);
    }
    
    // 准备语言选项
    const languageItems = SUPPORTED_LANGUAGES.map(lang => ({
        label: `${lang.icon || '📄'} ${lang.name}`,
        description: lang.extensions.join(', '),
        language: lang.name
    }));
    
    // 如果检测到语言，将匹配的语言排在前面
    if (detectedLanguage) {
        languageItems.sort((a, b) => {
            if (a.language === detectedLanguage) return -1;
            if (b.language === detectedLanguage) return 1;
            return 0;
        });
    }
    
    // 显示语言选择
    const selectedLanguage = await vscode.window.showQuickPick(languageItems, {
        placeHolder: detectedLanguage 
            ? `检测到当前文件类型: ${detectedLanguage}，选择文件类型 (回车确认)` 
            : '选择要创建的文件类型',
        matchOnDescription: true
    });
    
    if (!selectedLanguage) {
        return;
    }
    
    const languageConfig = SUPPORTED_LANGUAGES.find(l => l.name === selectedLanguage.language);
    if (!languageConfig) {
        return;
    }
    
    // 选择扩展名（如果有多个）
    let selectedExtension = languageConfig.extensions[0];
    if (languageConfig.extensions.length > 1) {
        const extPick = await vscode.window.showQuickPick(
            languageConfig.extensions.map(ext => ({ label: ext, description: `${selectedLanguage.language} 文件` })),
            { placeHolder: '选择文件扩展名' }
        );
        if (!extPick) {
            return;
        }
        selectedExtension = extPick.label;
    }
    
    // 输入文件名
    const fileName = await vscode.window.showInputBox({
        prompt: '输入文件名 (不需要输入扩展名)',
        placeHolder: `例如: index (将创建 index${selectedExtension})`,
        validateInput: (value) => {
            if (!value.trim()) {
                return '请输入文件名';
            }
            if (/[<>:"/\\|?*]/.test(value)) {
                return '文件名包含非法字符';
            }
            return null;
        }
    });
    
    if (!fileName) {
        return;
    }
    
    // 构建完整文件路径
    const fullFileName = fileName.endsWith(selectedExtension) 
        ? fileName 
        : fileName + selectedExtension;
    const filePath = path.join(targetDir, fullFileName);
    
    // 检查文件是否已存在
    if (fileExists(filePath)) {
        const overwrite = await vscode.window.showWarningMessage(
            `文件 ${fullFileName} 已存在，是否覆盖？`,
            '覆盖',
            '取消'
        );
        if (overwrite !== '覆盖') {
            return;
        }
    }
    
    // 生成模板内容并创建文件
    const content = generateTemplateContent(fileName, selectedExtension);
    await createAndOpenFile(filePath, content);
}

// 指定扩展名创建文件
async function createFileWithExtension(uri: vscode.Uri | undefined) {
    const targetDir = getTargetDirectory(uri);
    
    // 输入完整文件名（包含扩展名）
    const fullFileName = await vscode.window.showInputBox({
        prompt: '输入完整文件名 (包含扩展名)',
        placeHolder: '例如: index.js, main.py, App.vue',
        validateInput: (value) => {
            if (!value.trim()) {
                return '请输入文件名';
            }
            if (/[<>:"|?*]/.test(value)) {
                return '文件名包含非法字符';
            }
            if (!path.extname(value)) {
                return '请包含文件扩展名';
            }
            return null;
        }
    });
    
    if (!fullFileName) {
        return;
    }
    
    const filePath = path.join(targetDir, fullFileName);
    
    // 检查文件是否已存在
    if (fileExists(filePath)) {
        const overwrite = await vscode.window.showWarningMessage(
            `文件 ${fullFileName} 已存在，是否覆盖？`,
            '覆盖',
            '取消'
        );
        if (overwrite !== '覆盖') {
            return;
        }
    }
    
    // 生成模板内容并创建文件
    const extension = path.extname(fullFileName);
    const baseName = path.basename(fullFileName, extension);
    const content = generateTemplateContent(baseName, extension);
    await createAndOpenFile(filePath, content);
}

// 插件激活
export function activate(context: vscode.ExtensionContext) {
    console.log('Quick Create File 插件已激活');
    
    // 注册智能创建命令
    const createFileCommand = vscode.commands.registerCommand(
        'quickCreateFile.createFile',
        (uri) => createFile(uri)
    );
    
    // 注册指定扩展名创建命令
    const createFileWithExtCommand = vscode.commands.registerCommand(
        'quickCreateFile.createFileWithExtension',
        (uri) => createFileWithExtension(uri)
    );
    
    context.subscriptions.push(createFileCommand, createFileWithExtCommand);
}

// 插件停用
export function deactivate() {
    console.log('Quick Create File 插件已停用');
}
