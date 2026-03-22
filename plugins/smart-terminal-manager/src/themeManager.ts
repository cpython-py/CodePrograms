import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TerminalTheme, TerminalColors, PRESET_THEMES } from './types';

/**
 * 主题管理器 - 支持背景颜色、智能字体调整
 */
export class ThemeManager {
    private context: vscode.ExtensionContext;
    private customThemes: Map<string, TerminalTheme> = new Map();
    private currentBackgroundColor: string | null = null;
    
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadCustomThemes();
        this.loadBackgroundConfig();
    }
    
    /**
     * 获取所有主题
     */
    getAllThemes(): TerminalTheme[] {
        const customThemes = Array.from(this.customThemes.values());
        return [...PRESET_THEMES, ...customThemes];
    }
    
    /**
     * 获取主题
     */
    getTheme(id: string): TerminalTheme | undefined {
        return this.getAllThemes().find(t => t.id === id);
    }
    
    /**
     * 获取当前主题
     */
    getCurrentTheme(): TerminalTheme {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        const themeId = config.get<string>('defaultTheme', 'default');
        return this.getTheme(themeId) || PRESET_THEMES[0];
    }
    
    /**
     * 应用主题
     */
    async applyTheme(theme: TerminalTheme): Promise<void> {
        const config = vscode.workspace.getConfiguration();
        
        // 获取现有颜色配置并合并
        const existingColors = config.get<any>('workbench.colorCustomizations') || {};
        
        // 构建终端颜色配置
        const colorCustomizations = {
            ...existingColors,
            'terminal.background': this.currentBackgroundColor || theme.colors.background,
            'terminal.foreground': theme.colors.foreground,
            'terminalCursor.background': theme.colors.cursor,
            'terminalCursor.foreground': theme.colors.cursorAccent || theme.colors.foreground,
            'terminal.selectionBackground': theme.colors.selection,
            'terminal.ansiBlack': theme.colors.black,
            'terminal.ansiRed': theme.colors.red,
            'terminal.ansiGreen': theme.colors.green,
            'terminal.ansiYellow': theme.colors.yellow,
            'terminal.ansiBlue': theme.colors.blue,
            'terminal.ansiMagenta': theme.colors.magenta,
            'terminal.ansiCyan': theme.colors.cyan,
            'terminal.ansiWhite': theme.colors.white,
            'terminal.ansiBrightBlack': theme.colors.brightBlack,
            'terminal.ansiBrightRed': theme.colors.brightRed,
            'terminal.ansiBrightGreen': theme.colors.brightGreen,
            'terminal.ansiBrightYellow': theme.colors.brightYellow,
            'terminal.ansiBrightBlue': theme.colors.brightBlue,
            'terminal.ansiBrightMagenta': theme.colors.brightMagenta,
            'terminal.ansiBrightCyan': theme.colors.brightCyan,
            'terminal.ansiBrightWhite': theme.colors.brightWhite
        };
        
        // 使用 Global 配置确保生效
        config.update('workbench.colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Global);
        
        // 更新默认主题设置
        config.update('smartTerminal.defaultTheme', theme.id, vscode.ConfigurationTarget.Global);
        
        // 智能字体调整
        if (theme.recommendedFont) {
            await this.applySmartFontAdjustment(theme);
        }
    }
    
    /**
     * 设置背景颜色
     * 直接修改 settings.json 文件，绕过 VS Code API 对 JSON 注释的限制
     */
    async setBackgroundColor(color: string): Promise<void> {
        // 保存到扩展配置
        const smartConfig = vscode.workspace.getConfiguration('smartTerminal');
        this.currentBackgroundColor = color;
        await smartConfig.update('backgroundColor', color, vscode.ConfigurationTarget.Global);
        
        // 获取当前主题
        const currentTheme = this.getCurrentTheme();
        
        // 构建终端颜色配置
        const terminalColors: Record<string, string> = {
            'terminal.background': color,
            'terminal.foreground': currentTheme.colors.foreground || '#d4d4d4',
            'terminalCursor.background': currentTheme.colors.cursor || '#aeafad',
            'terminalCursor.foreground': currentTheme.colors.cursorAccent || currentTheme.colors.foreground || '#d4d4d4',
            'terminal.selectionBackground': currentTheme.colors.selection || '#264f78',
            'terminal.ansiBlack': currentTheme.colors.black || '#000000',
            'terminal.ansiRed': currentTheme.colors.red || '#cd3131',
            'terminal.ansiGreen': currentTheme.colors.green || '#0dbc79',
            'terminal.ansiYellow': currentTheme.colors.yellow || '#e5e510',
            'terminal.ansiBlue': currentTheme.colors.blue || '#2472c8',
            'terminal.ansiMagenta': currentTheme.colors.magenta || '#bc3fbc',
            'terminal.ansiCyan': currentTheme.colors.cyan || '#11a8cd',
            'terminal.ansiWhite': currentTheme.colors.white || '#e5e5e5',
            'terminal.ansiBrightBlack': currentTheme.colors.brightBlack || '#666666',
            'terminal.ansiBrightRed': currentTheme.colors.brightRed || '#f14c4c',
            'terminal.ansiBrightGreen': currentTheme.colors.brightGreen || '#23d18b',
            'terminal.ansiBrightYellow': currentTheme.colors.brightYellow || '#f5f543',
            'terminal.ansiBrightBlue': currentTheme.colors.brightBlue || '#3b8eea',
            'terminal.ansiBrightMagenta': currentTheme.colors.brightMagenta || '#d670d6',
            'terminal.ansiBrightCyan': currentTheme.colors.brightCyan || '#29b8db',
            'terminal.ansiBrightWhite': currentTheme.colors.brightWhite || '#e5e5e5'
        };
        
        // 直接修改 settings.json 文件
        try {
            await this.updateSettingsJsonFile(terminalColors);
            vscode.window.showInformationMessage(`✅ 已设置终端背景颜色: ${color}`, '重新加载').then(selection => {
                if (selection === '重新加载') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`设置背景颜色失败: ${error}`);
        }
    }
    
    /**
     * 直接更新 settings.json 文件
     */
    private async updateSettingsJsonFile(terminalColors: Record<string, string>): Promise<void> {
        const settingsPath = path.join(
            process.env.APPDATA || process.env.HOME || '',
            'Code',
            'User',
            'settings.json'
        );
        
        if (!fs.existsSync(settingsPath)) {
            throw new Error('settings.json 文件不存在');
        }
        
        let content = fs.readFileSync(settingsPath, 'utf-8');
        
        // 找到 workbench.colorCustomizations 部分
        const colorCustomizationsMatch = content.match(/"workbench\.colorCustomizations"\s*:\s*\{/);
        
        if (colorCustomizationsMatch) {
            // 找到 colorCustomizations 对象的起始和结束位置
            const startIndex = content.indexOf(colorCustomizationsMatch[0]);
            let braceCount = 0;
            let endIndex = startIndex;
            let foundStart = false;
            
            for (let i = startIndex; i < content.length; i++) {
                if (content[i] === '{') {
                    braceCount++;
                    foundStart = true;
                } else if (content[i] === '}') {
                  braceCount--;
                  if (foundStart && braceCount === 0) {
                      endIndex = i;
                      break;
                  }
                }
            }
            
            // 提取现有的 colorCustomizations 内容
            const existingBlock = content.substring(startIndex, endIndex + 1);
            
            // 解析现有配置（使用简单的方式处理 JSONC）
            const jsonContent = existingBlock.replace(/"workbench\.colorCustomizations"\s*:\s*/, '');
            const cleanedJson = this.cleanJsonc(jsonContent);
            
            let existingColors: Record<string, any>;
            try {
                existingColors = JSON.parse(cleanedJson);
            } catch {
                existingColors = {};
            }
            
            // 移除旧的终端颜色配置
            for (const key of Object.keys(existingColors)) {
                if (key.startsWith('terminal.')) {
                    delete existingColors[key];
                }
            }
            
            // 合并新的终端颜色配置
            const newColors = { ...existingColors, ...terminalColors };
            
            // 构建新的 colorCustomizations 块
            const newBlock = '"workbench.colorCustomizations": ' + JSON.stringify(newColors, null, 2);
            
            // 替换内容
            content = content.substring(0, startIndex) + newBlock + content.substring(endIndex + 1);
        } else {
            // 如果不存在 colorCustomizations，添加它
            // 找到最后一个属性的位置
            const lastBraceIndex = content.lastIndexOf('}');
            const insertContent = ',\n  "workbench.colorCustomizations": ' + JSON.stringify(terminalColors, null, 2) + '\n';
            content = content.substring(0, lastBraceIndex) + insertContent + content.substring(lastBraceIndex);
        }
        
        fs.writeFileSync(settingsPath, content, 'utf-8');
    }
    
    /**
     * 清理 JSONC（移除注释和尾随逗号）
     */
    private cleanJsonc(jsonc: string): string {
        // 移除单行注释
        let result = jsonc.replace(/\/\/[^\n]*/g, '');
        // 移除多行注释
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        // 移除尾随逗号
        result = result.replace(/,(\s*[}\]])/g, '$1');
        return result;
    }
    
    /**
     * 清除背景
     */
    async clearBackground(): Promise<void> {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        
        this.currentBackgroundColor = null;
        config.update('backgroundColor', '', vscode.ConfigurationTarget.Global);
        
        // 重置主题
        const currentTheme = this.getCurrentTheme();
        await this.applyTheme(currentTheme);
        
        vscode.window.showInformationMessage('✅ 已清除终端背景颜色');
    }
    
    /**
     * 获取 ANSI 颜色配置
     */
    private getAnsiColors(colors: TerminalColors): any {
        return {
            'terminal.ansiBlack': colors.black,
            'terminal.ansiRed': colors.red,
            'terminal.ansiGreen': colors.green,
            'terminal.ansiYellow': colors.yellow,
            'terminal.ansiBlue': colors.blue,
            'terminal.ansiMagenta': colors.magenta,
            'terminal.ansiCyan': colors.cyan,
            'terminal.ansiWhite': colors.white,
            'terminal.ansiBrightBlack': colors.brightBlack,
            'terminal.ansiBrightRed': colors.brightRed,
            'terminal.ansiBrightGreen': colors.brightGreen,
            'terminal.ansiBrightYellow': colors.brightYellow,
            'terminal.ansiBrightBlue': colors.brightBlue,
            'terminal.ansiBrightMagenta': colors.brightMagenta,
            'terminal.ansiBrightCyan': colors.brightCyan,
            'terminal.ansiBrightWhite': colors.brightWhite
        };
    }
    
    /**
     * 智能字体调整
     */
    async applySmartFontAdjustment(theme: TerminalTheme): Promise<void> {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        const smartEnabled = config.get<boolean>('smartFontEnabled', true);
        
        if (!smartEnabled || !theme.recommendedFont) {
            return;
        }
        
        const minSize = config.get<number>('minFontSize', 10);
        const maxSize = config.get<number>('maxFontSize', 24);
        const recommendedSize = theme.recommendedFont.size || 14;
        
        // 根据主题亮度调整字体大小
        const luminance = this.calculateLuminance(theme.colors.background);
        let adjustedSize = recommendedSize;
        
        // 暗色主题稍微增大字体
        if (luminance < 0.3) {
            adjustedSize = Math.min(recommendedSize + 1, maxSize);
        }
        // 亮色主题保持推荐大小
        else {
            adjustedSize = recommendedSize;
        }
        
        // 应用字体配置
        const terminalConfig = vscode.workspace.getConfiguration();
        
        if (theme.recommendedFont.family) {
            terminalConfig.update('terminal.integrated.fontFamily', theme.recommendedFont.family, vscode.ConfigurationTarget.Global);
        }
        
        terminalConfig.update('terminal.integrated.fontSize', adjustedSize, vscode.ConfigurationTarget.Global);
        
        if (theme.recommendedFont.weight) {
            const fontWeight = theme.recommendedFont.weight === 'bold' ? 'bold' : 
                              theme.recommendedFont.weight === 'light' ? '300' : 'normal';
            terminalConfig.update('terminal.integrated.fontWeight', fontWeight, vscode.ConfigurationTarget.Global);
        }
    }
    
    /**
     * 计算颜色亮度
     */
    private calculateLuminance(hexColor: string): number {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        return luminance;
    }
    
    /**
     * 创建自定义主题
     */
    async createTheme(): Promise<TerminalTheme | undefined> {
        const name = await vscode.window.showInputBox({
            prompt: '输入主题名称',
            placeHolder: '我的主题'
        });
        
        if (!name) {
            return undefined;
        }
        
        const id = name.toLowerCase().replace(/\s+/g, '-');
        
        const baseThemes = PRESET_THEMES.map(t => ({
            label: t.name,
            description: t.description,
            id: t.id
        }));
        
        const selectedBase = await vscode.window.showQuickPick(baseThemes, {
            placeHolder: '选择一个基础主题进行修改'
        });
        
        if (!selectedBase) {
            return undefined;
        }
        
        const baseTheme = this.getTheme(selectedBase.id);
        if (!baseTheme) {
            return undefined;
        }
        
        const newTheme: TerminalTheme = {
            id: `custom-${id}`,
            name: name,
            description: '自定义主题',
            colors: { ...baseTheme.colors },
            recommendedFont: { ...baseTheme.recommendedFont } || { size: 14 }
        };
        
        const colorsToEdit = [
            { key: 'background', label: '背景色' },
            { key: 'foreground', label: '前景色' },
            { key: 'cursor', label: '光标色' },
            { key: 'red', label: '红色' },
            { key: 'green', label: '绿色' },
            { key: 'blue', label: '蓝色' },
            { key: 'yellow', label: '黄色' },
            { key: 'cyan', label: '青色' },
            { key: 'magenta', label: '洋红色' }
        ];
        
        const editMore = await vscode.window.showQuickPick(
            colorsToEdit.map(c => ({ label: c.label, key: c.key })),
            { placeHolder: '选择要修改的颜色', canPickMany: true }
        );
        
        if (editMore && editMore.length > 0) {
            for (const item of editMore) {
                const currentColor = (newTheme.colors as any)[item.key] || '#ffffff';
                const color = await vscode.window.showInputBox({
                    prompt: `输入 ${item.label} (当前: ${currentColor})`,
                    placeHolder: '#ffffff',
                    value: currentColor,
                    validateInput: (value) => {
                        if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
                            return '请输入有效的十六进制颜色 (例如: #ffffff)';
                        }
                        return null;
                    }
                });
                
                if (color) {
                    (newTheme.colors as any)[item.key] = color;
                }
            }
        }
        
        const setFont = await vscode.window.showQuickPick(
            ['使用默认字体', '自定义字体'],
            { placeHolder: '是否设置推荐字体?' }
        );
        
        if (setFont === '自定义字体') {
            const fontSize = await vscode.window.showInputBox({
                prompt: '输入推荐字体大小',
                placeHolder: '14',
                value: '14',
                validateInput: (value) => {
                    const num = parseInt(value);
                    if (isNaN(num) || num < 8 || num > 32) {
                        return '字体大小必须在 8-32 之间';
                    }
                    return null;
                }
            });
            
            if (fontSize) {
                newTheme.recommendedFont = {
                    size: parseInt(fontSize)
                };
            }
        }
        
        this.customThemes.set(newTheme.id, newTheme);
        this.saveCustomThemes();
        
        return newTheme;
    }
    
    /**
     * 删除自定义主题
     */
    deleteTheme(id: string): boolean {
        if (this.customThemes.has(id)) {
            this.customThemes.delete(id);
            this.saveCustomThemes();
            return true;
        }
        return false;
    }
    
    /**
     * 加载自定义主题
     */
    private loadCustomThemes(): void {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        const themes = config.get<Record<string, TerminalTheme>>('customThemes', {});
        
        for (const [id, theme] of Object.entries(themes)) {
            this.customThemes.set(id, theme);
        }
    }
    
    /**
     * 保存自定义主题
     */
    private saveCustomThemes(): void {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        const themes: Record<string, TerminalTheme> = {};
        
        for (const [id, theme] of this.customThemes) {
            themes[id] = theme;
        }
        
        config.update('customThemes', themes, vscode.ConfigurationTarget.Global);
    }
    
    /**
     * 加载背景配置
     */
    private loadBackgroundConfig(): void {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        const color = config.get<string>('backgroundColor', '');
        
        if (color) {
            this.currentBackgroundColor = color;
        }
    }
    
    /**
     * 获取终端配置
     */
    getTerminalConfig() {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        
        return {
            fontSize: config.get<number>('fontSize', 14),
            fontFamily: config.get<string>('fontFamily', "Consolas, 'Courier New', monospace"),
            cursorStyle: config.get<'block' | 'underline' | 'line'>('cursorStyle', 'block'),
            cursorBlink: config.get<boolean>('cursorBlink', true),
            scrollback: config.get<number>('scrollback', 10000),
            shellPath: config.get<string>('shellPath', ''),
            autoClose: config.get<boolean>('autoClose', true)
        };
    }
    
    /**
     * 应用终端配置
     */
    applyTerminalConfig(): void {
        const config = vscode.workspace.getConfiguration();
        const terminalConfig = this.getTerminalConfig();
        
        config.update('terminal.integrated.fontSize', terminalConfig.fontSize, vscode.ConfigurationTarget.Global);
        config.update('terminal.integrated.fontFamily', terminalConfig.fontFamily, vscode.ConfigurationTarget.Global);
        config.update('terminal.integrated.cursorStyle', terminalConfig.cursorStyle, vscode.ConfigurationTarget.Global);
        config.update('terminal.integrated.cursorBlinking', terminalConfig.cursorBlink, vscode.ConfigurationTarget.Global);
        config.update('terminal.integrated.scrollback', terminalConfig.scrollback, vscode.ConfigurationTarget.Global);
        
        if (terminalConfig.shellPath) {
            config.update('terminal.integrated.shell.windows', terminalConfig.shellPath, vscode.ConfigurationTarget.Global);
        }
        
        config.update('terminal.integrated.autoCloseAfterExit', terminalConfig.autoClose ? 'always' : 'never', vscode.ConfigurationTarget.Global);
    }
}
