import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ThemeManager } from './themeManager';
import { CommandManager } from './commandManager';
import { TabManager } from './tabManager';
import { TerminalTheme, CustomCommand, CommandGroup, TerminalTab } from './types';

let themeManager: ThemeManager;
let commandManager: CommandManager;
let tabManager: TabManager;

/**
 * 主视图提供者
 */
class MainViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }
    
    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (!element) {
            return Promise.resolve([
                this.createActionItem('🚀 新建终端', 'smartTerminal.newTerminal', 'add'),
                this.createActionItem('🎨 选择主题', 'smartTerminal.applyTheme', 'palette'),
                this.createActionItem('🖼️ 设置背景', 'smartTerminal.setBackground', 'image'),
                this.createActionItem('⚡ 快捷命令', 'smartTerminal.quickCommand', 'zap'),
                this.createActionItem('📋 选择终端', 'smartTerminal.selectTerminal', 'list-unordered'),
                this.createActionItem('⚙️ 终端设置', 'smartTerminal.settings', 'gear')
            ]);
        }
        return Promise.resolve([]);
    }
    
    private createActionItem(label: string, command: string, icon: string, args?: string): vscode.TreeItem {
        const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
        item.iconPath = new vscode.ThemeIcon(icon);
        item.command = {
            command: command,
            title: label,
            arguments: args ? [args] : undefined
        };
        return item;
    }
}

/**
 * 命令视图提供者
 */
class CommandsViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    
    constructor(private commandManager: CommandManager) {}
    
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }
    
    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (!element) {
            const groups = this.commandManager.getAllGroups();
            return Promise.resolve(groups.map(g => {
                const item = new vscode.TreeItem(g.name, vscode.TreeItemCollapsibleState.Collapsed);
                item.iconPath = new vscode.ThemeIcon(g.icon || 'folder');
                item.contextValue = 'group';
                item.id = g.id;
                return item;
            }));
        }
        
        // 返回分组下的命令
        const groupId = element.id;
        if (groupId) {
            const group = this.commandManager.getGroup(groupId);
            if (group) {
                return Promise.resolve(group.commands.map(c => {
                    const item = new vscode.TreeItem(c.name, vscode.TreeItemCollapsibleState.None);
                    item.description = c.command;
                    item.iconPath = new vscode.ThemeIcon(c.icon || 'terminal');
                    item.contextValue = 'command';
                    item.id = c.id;
                    item.command = {
                        command: 'smartTerminal.runCustomCommand',
                        title: 'Run',
                        arguments: [c]
                    };
                    return item;
                }));
            }
        }
        
        return Promise.resolve([]);
    }
}

/**
 * 主题视图提供者
 */
class ThemesViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    
    constructor(private themeManager: ThemeManager) {}
    
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }
    
    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (!element) {
            const themes = this.themeManager.getAllThemes();
            const currentTheme = this.themeManager.getCurrentTheme();
            
            return Promise.resolve(themes.map(t => {
                const item = new vscode.TreeItem(t.name, vscode.TreeItemCollapsibleState.None);
                item.description = t.description;
                item.iconPath = new vscode.ThemeIcon('color-palette');
                item.contextValue = 'theme';
                item.id = t.id;
                
                if (t.id === currentTheme.id) {
                    item.label = `✓ ${t.name}`;
                }
                
                item.command = {
                    command: 'smartTerminal.applyThemeById',
                    title: 'Apply Theme',
                    arguments: [t.id]
                };
                
                return item;
            }));
        }
        
        return Promise.resolve([]);
    }
}

/**
 * 终端选择器面板
 */
class TerminalSelectorPanel {
    public static currentPanel: TerminalSelectorPanel | undefined;
    public static readonly viewType = 'smartTerminal.selector';
    
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    
    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        
        // 如果已有面板，显示它
        if (TerminalSelectorPanel.currentPanel) {
            TerminalSelectorPanel.currentPanel._panel.reveal(column);
            return;
        }
        
        // 创建新面板
        const panel = vscode.window.createWebviewPanel(
            TerminalSelectorPanel.viewType,
            '终端选择器',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        
        TerminalSelectorPanel.currentPanel = new TerminalSelectorPanel(panel, extensionUri);
    }
    
    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        
        this._update();
        
        // 监听面板关闭
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        
        // 处理来自 Webview 的消息
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'selectTerminal':
                        this._selectTerminal(message.index);
                        break;
                    case 'closeTerminal':
                        this._closeTerminal(message.index);
                        break;
                    case 'createTerminal':
                        this._createTerminal();
                        break;
                }
            },
            null,
            this._disposables
        );
    }
    
    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }
    
    private _getHtmlForWebview(webview: vscode.Webview): string {
        const terminals = vscode.window.terminals;
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>终端选择器</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 10px;
            margin: 0;
        }
        .terminal-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .terminal-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: var(--vscode-list-hoverBackground);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .terminal-item:hover {
            background: var(--vscode-list-activeSelectionBackground);
        }
        .terminal-name {
            font-size: 14px;
            font-weight: 500;
        }
        .terminal-actions {
            display: flex;
            gap: 8px;
        }
        .btn {
            background: transparent;
            border: 1px solid var(--vscode-button-border);
            color: var(--vscode-button-foreground);
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .btn-close {
            color: #f14c4c;
            border-color: #f14c4c;
        }
        .btn-close:hover {
            background: rgba(241, 76, 76, 0.2);
        }
        .create-btn {
            width: 100%;
            padding: 14px;
            margin-top: 12px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
        }
        .create-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--vscode-descriptionForeground);
        }
        .empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="terminal-list">
        ${terminals.length > 0 ? terminals.map((t, i) => `
            <div class="terminal-item" onclick="selectTerminal(${i})">
                <span class="terminal-name">🖥️ ${t.name}</span>
                <div class="terminal-actions">
                    <button class="btn" onclick="event.stopPropagation(); selectTerminal(${i})">选择</button>
                    <button class="btn btn-close" onclick="event.stopPropagation(); closeTerminal(${i})">关闭</button>
                </div>
            </div>
        `).join('') : `
            <div class="empty-state">
                <div class="empty-icon">🖥️</div>
                <p>没有打开的终端</p>
            </div>
        `}
    </div>
    <button class="create-btn" onclick="createTerminal()">➕ 新建终端</button>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function selectTerminal(index) {
            vscode.postMessage({ command: 'selectTerminal', index });
        }
        
        function closeTerminal(index) {
            vscode.postMessage({ command: 'closeTerminal', index });
        }
        
        function createTerminal() {
            vscode.postMessage({ command: 'createTerminal' });
        }
    </script>
</body>
</html>`;
    }
    
    private async _selectTerminal(index: number) {
        const terminals = vscode.window.terminals;
        if (terminals[index]) {
            terminals[index].show();
            this._panel.dispose();
        }
    }
    
    private async _closeTerminal(index: number) {
        const terminals = vscode.window.terminals;
        if (terminals[index]) {
            terminals[index].dispose();
            this._update();
        }
    }
    
    private async _createTerminal() {
        const terminal = vscode.window.createTerminal('Smart Terminal');
        terminal.show();
        this._update();
    }
    
    public dispose() {
        TerminalSelectorPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

/**
 * 插件激活
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Smart Terminal Manager 2.0 已激活');
    
    // 初始化管理器
    themeManager = new ThemeManager(context);
    commandManager = new CommandManager(context);
    tabManager = new TabManager(context);
    
    // 注册视图提供者
    const mainViewProvider = new MainViewProvider();
    const commandsViewProvider = new CommandsViewProvider(commandManager);
    const themesViewProvider = new ThemesViewProvider(themeManager);
    
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('smartTerminal.mainView', mainViewProvider),
        vscode.window.registerTreeDataProvider('smartTerminal.commandsView', commandsViewProvider),
        vscode.window.registerTreeDataProvider('smartTerminal.themesView', themesViewProvider)
    );
    
    // 注册命令
    registerCommands(context, mainViewProvider, commandsViewProvider, themesViewProvider);
    
    // 应用默认主题和配置
    themeManager.applyTerminalConfig();
    
    // 显示欢迎消息
    vscode.window.showInformationMessage('🚀 Smart Terminal Manager 2.0 已激活');
}

/**
 * 注册所有命令
 */
function registerCommands(
    context: vscode.ExtensionContext,
    mainViewProvider: MainViewProvider,
    commandsViewProvider: CommandsViewProvider,
    themesViewProvider: ThemesViewProvider
) {
    // 打开终端
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.open', () => {
            const terminal = vscode.window.createTerminal({
                name: 'Smart Terminal',
                iconPath: new vscode.ThemeIcon('terminal')
            });
            terminal.show();
        })
    );
    
    // 新建终端
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.newTerminal', async () => {
            const name = await vscode.window.showInputBox({
                prompt: '输入终端名称',
                placeHolder: 'Smart Terminal'
            });
            
            const terminal = vscode.window.createTerminal({
                name: name || 'Smart Terminal',
                iconPath: new vscode.ThemeIcon('terminal')
            });
            terminal.show();
        })
    );
    
    // 运行自定义命令
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.runCustomCommand', (command?: CustomCommand) => {
            if (command) {
                commandManager.executeCommand(command);
            }
        })
    );
    
    // 快捷命令面板
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.quickCommand', () => {
            commandManager.showQuickCommandPicker();
        })
    );
    
    // 管理命令
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.manageCommands', async () => {
            const options = [
                { label: '➕ 添加命令', action: 'add' },
                { label: '✏️ 编辑命令', action: 'edit' },
                { label: '🗑️ 删除命令', action: 'delete' }
            ];
            
            const selected = await vscode.window.showQuickPick(options, {
                placeHolder: '选择操作'
            });
            
            if (!selected) {
                return;
            }
            
            switch (selected.action) {
                case 'add':
                    const newCommand = await commandManager.addCommand();
                    if (newCommand) {
                        vscode.window.showInformationMessage(`已添加命令: ${newCommand.name}`);
                        commandsViewProvider.refresh();
                    }
                    break;
                    
                case 'edit':
                    const commands = commandManager.getAllCommands();
                    const toEdit = await vscode.window.showQuickPick(
                        commands.map(c => ({ label: c.name, description: c.command, id: c.id })),
                        { placeHolder: '选择要编辑的命令' }
                    );
                    if (toEdit) {
                        await commandManager.editCommand(toEdit.id);
                        commandsViewProvider.refresh();
                    }
                    break;
                    
                case 'delete':
                    const commandsToDelete = commandManager.getAllCommands();
                    const toDelete = await vscode.window.showQuickPick(
                        commandsToDelete.map(c => ({ label: c.name, description: c.command, id: c.id })),
                        { placeHolder: '选择要删除的命令' }
                    );
                    if (toDelete) {
                        const confirm = await vscode.window.showWarningMessage(
                            `确定删除命令 "${toDelete.label}"?`,
                            '确定',
                            '取消'
                        );
                        if (confirm === '确定') {
                            commandManager.deleteCommand(toDelete.id);
                            commandsViewProvider.refresh();
                            vscode.window.showInformationMessage('命令已删除');
                        }
                    }
                    break;
            }
        })
    );
    
    // 应用主题
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.applyTheme', async () => {
            const themes = themeManager.getAllThemes();
            const items = themes.map(t => ({
                label: t.name,
                description: t.description,
                id: t.id
            }));
            
            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: '选择要应用的主题'
            });
            
            if (selected) {
                const theme = themeManager.getTheme(selected.id);
                if (theme) {
                    await themeManager.applyTheme(theme);
                    themesViewProvider.refresh();
                    vscode.window.showInformationMessage(`已应用主题: ${theme.name}`);
                }
            }
        })
    );
    
    // 通过ID应用主题
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.applyThemeById', async (themeId: string) => {
            const theme = themeManager.getTheme(themeId);
            if (theme) {
                await themeManager.applyTheme(theme);
                themesViewProvider.refresh();
                vscode.window.showInformationMessage(`已应用主题: ${theme.name}`);
            }
        })
    );
    
    // 创建主题
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.createTheme', async () => {
            const newTheme = await themeManager.createTheme();
            if (newTheme) {
                themesViewProvider.refresh();
                const apply = await vscode.window.showInformationMessage(
                    `主题 "${newTheme.name}" 已创建`,
                    '应用主题'
                );
                if (apply) {
                    await themeManager.applyTheme(newTheme);
                    themesViewProvider.refresh();
                }
            }
        })
    );
    
    // 设置背景颜色
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.setBackground', async () => {
            const options = [
                { label: '🎨 设置背景颜色', action: 'color', description: '直接设置终端背景颜色' },
                { label: '❌ 清除背景颜色', action: 'clear', description: '恢复默认背景' }
            ];
            
            const selected = await vscode.window.showQuickPick(options, {
                placeHolder: '选择背景设置方式'
            });
            
            if (!selected) {
                return;
            }
            
            switch (selected.action) {
                case 'color':
                    const color = await vscode.window.showInputBox({
                        prompt: '输入背景颜色 (十六进制)',
                        placeHolder: '#1e1e1e',
                        value: '#1e1e1e',
                        validateInput: (value) => {
                            if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
                                return '请输入有效的十六进制颜色 (例如: #1e1e1e)';
                            }
                            return null;
                        }
                    });
                    
                    if (color) {
                        await themeManager.setBackgroundColor(color);
                    }
                    break;
                    
                case 'clear':
                    await themeManager.clearBackground();
                    break;
            }
        })
    );
    
    // 清除背景
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.clearBackground', async () => {
            await themeManager.clearBackground();
        })
    );
    
    // 智能字体调整
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.smartFontAdjust', async () => {
            const currentTheme = themeManager.getCurrentTheme();
            await themeManager.applySmartFontAdjustment(currentTheme);
            vscode.window.showInformationMessage('智能字体已根据当前主题调整');
        })
    );
    
    // 切换选项卡栏
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.toggleTabBar', () => {
            tabManager.toggleTabBar();
            const status = tabManager.isTabBarMinimized() ? '已最小化' : '已恢复';
            vscode.window.showInformationMessage(`选项卡栏 ${status}`);
        })
    );
    
    // 最小化所有选项卡
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.minimizeAllTabs', () => {
            tabManager.minimizeAllTabs();
            vscode.window.showInformationMessage('所有终端已最小化');
        })
    );
    
    // 恢复所有选项卡
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.restoreAllTabs', () => {
            tabManager.restoreAllTabs();
            vscode.window.showInformationMessage('所有终端已恢复');
        })
    );
    
    // 选择终端 (动态下拉框)
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.selectTerminal', () => {
            TerminalSelectorPanel.createOrShow(context.extensionUri);
        })
    );
    
    // 打开设置
    context.subscriptions.push(
        vscode.commands.registerCommand('smartTerminal.settings', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'smartTerminal');
        })
    );
}

/**
 * 插件停用
 */
export function deactivate() {
    console.log('Smart Terminal Manager 已停用');
}
