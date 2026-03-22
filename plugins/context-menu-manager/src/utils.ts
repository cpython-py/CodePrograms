/**
 * Context Menu Manager - 工具函数
 * 提供通用的辅助功能
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 生成唯一ID
 */
export function generateId(): string {
    return `menuItem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 验证菜单项配置
 */
export function validateMenuItem(item: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.id || typeof item.id !== 'string') {
        errors.push('菜单项必须包含有效的ID');
    }

    if (!item.isSeparator) {
        if (!item.label || typeof item.label !== 'string') {
            errors.push('菜单项必须包含显示文本');
        }

        if (!item.command || typeof item.command !== 'string') {
            errors.push('菜单项必须包含执行命令');
        }
    }

    if (item.type && !['command', 'script', 'terminal', 'url'].includes(item.type)) {
        errors.push('无效的执行类型');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 解析图标路径
 */
export function resolveIconPath(icon: string | undefined, context: vscode.ExtensionContext): vscode.ThemeIcon | vscode.Uri | undefined {
    if (!icon) {
        return undefined;
    }

    // 检查是否为VS Code内置图标（格式：$(icon-name)）
    if (icon.startsWith('$(') && icon.endsWith(')')) {
        const iconName = icon.slice(2, -1);
        return new vscode.ThemeIcon(iconName);
    }

    // 检查是否为文件路径
    if (icon.includes('/') || icon.includes('\\')) {
        // 相对路径转换为绝对路径
        if (!path.isAbsolute(icon)) {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                const absolutePath = path.join(workspaceFolders[0].uri.fsPath, icon);
                if (fs.existsSync(absolutePath)) {
                    return vscode.Uri.file(absolutePath);
                }
            }
        } else if (fs.existsSync(icon)) {
            return vscode.Uri.file(icon);
        }
    }

    return undefined;
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filePath: string): string {
    const match = filePath.match(/\.[^.]+$/);
    return match ? match[0] : '';
}

/**
 * 获取文件名（不含扩展名）
 */
export function getFileNameWithoutExtension(filePath: string): string {
    const baseName = path.basename(filePath);
    const ext = getFileExtension(filePath);
    return ext ? baseName.slice(0, -ext.length) : baseName;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 比较两个对象是否相等
 */
export function isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | undefined;

    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * 检查文件是否存在
 */
export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * 创建目录（如果不存在）
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
        // 目录已存在，忽略错误
    }
}

/**
 * 读取JSON文件
 */
export async function readJsonFile<T>(filePath: string): Promise<T | undefined> {
    try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(content) as T;
    } catch (error) {
        return undefined;
    }
}

/**
 * 写入JSON文件
 */
export async function writeJsonFile<T>(filePath: string, data: T, pretty: boolean = true): Promise<void> {
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    await fs.promises.writeFile(filePath, content, 'utf-8');
}

/**
 * 转义正则表达式特殊字符
 */
export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 匹配文件模式
 */
export function matchFilePattern(fileName: string, patterns: string[]): boolean {
    if (!patterns || patterns.length === 0) {
        return true;
    }

    for (const pattern of patterns) {
        // 简单的通配符匹配
        const regexPattern = escapeRegExp(pattern)
            .replace(/\\\*/g, '.*')
            .replace(/\\\?/g, '.');

        const regex = new RegExp(`^${regexPattern}$`, 'i');
        if (regex.test(fileName)) {
            return true;
        }
    }

    return false;
}

/**
 * 执行命令并返回结果
 */
export async function executeCommand(
    command: string,
    args: string[] = [],
    options: {
        cwd?: string;
        env?: Record<string, string>;
    } = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        const proc = exec(
            `${command} ${args.join(' ')}`,
            {
                cwd: options.cwd,
                env: { ...process.env, ...options.env }
            },
            (error: any, stdout: string, stderr: string) => {
                resolve({
                    stdout,
                    stderr,
                    exitCode: error ? error.code || 1 : 0
                });
            }
        );
    });
}

/**
 * 打开外部链接
 */
export async function openExternal(url: string): Promise<boolean> {
    try {
        return await vscode.env.openExternal(vscode.Uri.parse(url));
    } catch (error) {
        return false;
    }
}

/**
 * 显示输入框并获取用户输入
 */
export async function showInputBox(
    options: vscode.InputBoxOptions
): Promise<string | undefined> {
    return await vscode.window.showInputBox(options);
}

/**
 * 显示快速选择列表
 */
export async function showQuickPick<T extends vscode.QuickPickItem>(
    items: T[],
    options?: vscode.QuickPickOptions
): Promise<T | undefined> {
    return await vscode.window.showQuickPick(items, options);
}

/**
 * 显示信息消息
 */
export async function showInfo(message: string, ...items: string[]): Promise<string | undefined> {
    return await vscode.window.showInformationMessage(message, ...items);
}

/**
 * 显示警告消息
 */
export async function showWarning(message: string, ...items: string[]): Promise<string | undefined> {
    return await vscode.window.showWarningMessage(message, ...items);
}

/**
 * 显示错误消息
 */
export async function showError(message: string, ...items: string[]): Promise<string | undefined> {
    return await vscode.window.showErrorMessage(message, ...items);
}

/**
 * 显示进度提示
 */
export async function withProgress<T>(
    title: string,
    task: (
        progress: vscode.Progress<{ message?: string; increment?: number }>,
        token: vscode.CancellationToken
    ) => Thenable<T>
): Promise<T> {
    return await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title,
            cancellable: true
        },
        task
    );
}

/**
 * 创建输出通道
 */
export function createOutputChannel(name: string): vscode.OutputChannel {
    return vscode.window.createOutputChannel(name);
}

/**
 * 记录到输出通道
 */
export function logToChannel(
    channel: vscode.OutputChannel,
    message: string,
    level: 'info' | 'warning' | 'error' = 'info'
): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
    channel.appendLine(`[${timestamp}] ${prefix} ${message}`);
}

/**
 * 获取工作区根路径
 */
export function getWorkspaceRoot(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    return workspaceFolders && workspaceFolders.length > 0
        ? workspaceFolders[0].uri.fsPath
        : undefined;
}

/**
 * 相对路径转绝对路径
 */
export function toAbsolutePath(relativePath: string): string {
    const root = getWorkspaceRoot();
    if (!root) {
        return relativePath;
    }
    return path.isAbsolute(relativePath) ? relativePath : path.join(root, relativePath);
}

/**
 * 绝对路径转相对路径
 */
export function toRelativePath(absolutePath: string): string {
    const root = getWorkspaceRoot();
    if (!root) {
        return absolutePath;
    }
    return path.relative(root, absolutePath);
}
